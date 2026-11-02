(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {}
    }
  };

  const plantList = document.getElementById("plant-list");
  const plantForm = document.getElementById("plant-form");
  const nameInput = document.getElementById("plant-name");
  const typeInput = document.getElementById("plant-type");
  const intervalInput = document.getElementById("watering-interval");
  const emptyState = document.getElementById("empty-state");
  const plantCount = document.getElementById("plant-count");
  const plantCountLabel = document.getElementById("plant-count-label");
  const dueCount = document.getElementById("due-count");

  const typeById = Object.fromEntries(PLANT_TYPES.map(function (type) { return [type.id, type]; }));

  function appendTypeOptions(select) {
    let groupName = "";
    let group = null;
    PLANT_TYPES.forEach(function (type) {
      if (type.group !== groupName) {
        groupName = type.group;
        group = document.createElement("optgroup");
        group.label = groupName;
        select.append(group);
      }
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.name;
      group.append(option);
    });
  }

  function inferType(name) {
    const normalizedName = name.toLowerCase();
    const matches = {
      fern: "fern",
      monstera: "monstera",
      pothos: "pothos",
      "snake plant": "snake-plant",
      sansevieria: "snake-plant",
      "peace lily": "peace-lily",
      tomato: "tomato",
      basil: "basil",
      lettuce: "lettuce",
      pepper: "pepper",
      strawberry: "strawberry"
    };
    const match = Object.keys(matches).find(function (key) { return normalizedName.indexOf(key) !== -1; });
    return match ? matches[match] : "houseplant";
  }

  appendTypeOptions(typeInput);
  typeInput.value = "pothos";

  const savedPlants = storage.get(STORAGE_KEY, null);
  let plants = (savedPlants === null ? DEFAULT_PLANTS.map(function (plant) {
    return {
      id: "starter-" + plant.id,
      name: plant.name,
      type: plant.type,
      interval: plant.interval,
      lastWatered: new Date(Date.now() - plant.daysAgo * 86400000).toISOString()
    };
  }) : Array.isArray(savedPlants) ? savedPlants : []).filter(function (plant) {
    return plant && typeof plant.id === "string" && typeof plant.name === "string" &&
      Number.isFinite(Number(plant.interval)) && Number(plant.interval) > 0 &&
      Number.isFinite(Date.parse(plant.lastWatered));
  }).map(function (plant) {
    if (!typeById[plant.type]) plant.type = inferType(plant.name);
    return plant;
  });

  if (savedPlants === null) storage.set(STORAGE_KEY, plants);

  function savePlants() {
    storage.set(STORAGE_KEY, plants);
  }

  function dueDate(plant) {
    return Date.parse(plant.lastWatered) + Number(plant.interval) * 86400000;
  }

  function isDue(plant, now) {
    return dueDate(plant) <= now;
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function articleUrl(type) {
    return "https://en.wikipedia.org/wiki/" + encodeURIComponent(type.article.replace(/ /g, "_"));
  }

  const photoRequests = Object.create(null);
  function loadPhoto(type, image) {
    if (!photoRequests[type.id]) {
      photoRequests[type.id] = fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(type.article.replace(/ /g, "_")))
        .then(function (response) {
          if (!response.ok) throw new Error("Plant photo unavailable");
          return response.json();
        })
        .then(function (page) {
          if (!page.thumbnail || !page.thumbnail.source) throw new Error("Plant photo unavailable");
          return { url: page.thumbnail.source, fallback: false };
        })
        .catch(function () {
          return { url: "hosta-background.jpg", fallback: true };
        });
    }
    photoRequests[type.id].then(function (result) {
      image.src = result.url;
      image.classList.toggle("photo-fallback", result.fallback);
    });
  }

  function renderTips(list, type) {
    list.replaceChildren.apply(list, type.tips.map(function (tip) {
      const item = document.createElement("li");
      item.textContent = tip;
      return item;
    }));
  }

  function makePlantRow(plant, now) {
    const due = isDue(plant, now);
    const type = typeById[plant.type] || typeById.houseplant;
    const row = document.createElement("article");
    row.className = due ? "plant-row is-due" : "plant-row";

    const identity = document.createElement("div");
    identity.className = "plant-identity";
    const photo = document.createElement("img");
    photo.className = "plant-photo";
    photo.alt = type.name + " plant";
    photo.loading = "lazy";
    photo.referrerPolicy = "no-referrer";
    loadPhoto(type, photo);
    const details = document.createElement("div");
    details.className = "plant-details";
    const name = document.createElement("h3");
    name.textContent = plant.name;
    const species = document.createElement("p");
    species.className = "plant-species";
    species.textContent = type.name;
    const schedule = document.createElement("p");
    schedule.textContent = "Every " + plant.interval + " " + (Number(plant.interval) === 1 ? "day" : "days");
    details.append(name, species, schedule);
    identity.append(photo, details);

    const status = document.createElement("div");
    status.className = "plant-status";
    const statusLabel = document.createElement("span");
    statusLabel.className = due ? "status-label due-label" : "status-label";
    if (due) {
      const overdueDays = Math.floor((now - dueDate(plant)) / 86400000);
      statusLabel.textContent = overdueDays > 0 ? "Overdue · " + overdueDays + "d" : "Water today";
    } else {
      statusLabel.textContent = "Next · " + formatDate(dueDate(plant));
    }
    const lastWatered = document.createElement("span");
    lastWatered.className = "last-watered";
    lastWatered.textContent = "Last watered " + formatDate(Date.parse(plant.lastWatered));
    status.append(statusLabel, lastWatered);

    const actions = document.createElement("div");
    actions.className = "plant-actions";
    const wateredButton = document.createElement("button");
    wateredButton.type = "button";
    wateredButton.className = due ? "button watered-button" : "button watered-button is-quiet";
    wateredButton.textContent = "Watered";
    wateredButton.setAttribute("aria-label", "Mark " + plant.name + " as watered");
    wateredButton.addEventListener("click", function () {
      plant.lastWatered = new Date().toISOString();
      savePlants();
      renderPlants();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", "Remove " + plant.name);
    removeButton.addEventListener("click", function () {
      plants = plants.filter(function (item) { return item.id !== plant.id; });
      savePlants();
      renderPlants();
    });

    actions.append(wateredButton, removeButton);

    const care = document.createElement("details");
    care.className = "plant-care";
    const summary = document.createElement("summary");
    summary.textContent = "Nutrition & growing tips";
    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Plant type";
    const typeSelect = document.createElement("select");
    typeLabel.append(typeSelect);
    appendTypeOptions(typeSelect);
    typeSelect.value = type.id;
    const tips = document.createElement("ul");
    tips.className = "care-tips";
    renderTips(tips, type);
    const sourceLink = document.createElement("a");
    sourceLink.className = "photo-source";
    sourceLink.href = articleUrl(type);
    sourceLink.target = "_blank";
    sourceLink.rel = "noreferrer";
    sourceLink.textContent = "Photo and plant reference: Wikipedia";
    typeSelect.addEventListener("change", function () {
      plant.type = typeSelect.value;
      const selectedType = typeById[plant.type];
      photo.alt = selectedType.name + " plant";
      photo.src = "hosta-background.jpg";
      photo.classList.remove("photo-fallback");
      species.textContent = selectedType.name;
      loadPhoto(selectedType, photo);
      renderTips(tips, selectedType);
      sourceLink.href = articleUrl(selectedType);
      savePlants();
    });
    care.append(summary, typeLabel, tips, sourceLink);

    row.append(identity, status, actions, care);
    return row;
  }

  function renderPlants() {
    const now = Date.now();
    const orderedPlants = plants.slice().sort(function (first, second) {
      const firstDue = isDue(first, now);
      const secondDue = isDue(second, now);
      if (firstDue !== secondDue) return firstDue ? -1 : 1;
      if (firstDue) return dueDate(first) - dueDate(second);
      return Number(first.interval) - Number(second.interval);
    });

    plantList.replaceChildren.apply(plantList, orderedPlants.map(function (plant) {
      return makePlantRow(plant, now);
    }));
    emptyState.hidden = plants.length > 0;
    plantCount.textContent = String(plants.length);
    plantCountLabel.textContent = plants.length === 1 ? "plant" : "plants";

    const duePlants = plants.filter(function (plant) { return isDue(plant, now); }).length;
    dueCount.textContent = duePlants === 0
      ? "All caught up"
      : duePlants + " ready for water";
    dueCount.classList.toggle("has-due", duePlants > 0);
  }

  plantForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const type = typeInput.value;
    const interval = Number(intervalInput.value);
    if (!name || !typeById[type] || !Number.isInteger(interval) || interval < 1 || interval > 365) return;

    plants.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: name,
      type: type,
      interval: interval,
      lastWatered: new Date().toISOString()
    });
    savePlants();
    plantForm.reset();
    typeInput.value = "pothos";
    intervalInput.value = "7";
    nameInput.focus();
    renderPlants();
  });

  renderPlants();
})();
