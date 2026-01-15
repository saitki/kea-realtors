// ExclusiveCollection.js - Vanilla JavaScript
class ExclusiveCollection {
  constructor(containerId, data) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.filters = {
      priceRange: 'all',
      destinations: []
    };
    this.filteredProperties = [...data.properties];
    this.isFilterOpen = false;
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const activeFiltersCount = 
      (this.filters.priceRange !== 'all' ? 1 : 0) + 
      this.filters.destinations.length;

    const uniqueDestinations = [...new Set(this.data.properties.map(p => p.destination))];

    this.container.innerHTML = `
      <div class="col-12 col-md-10 mx-auto">
        <div class="exclusive-collection">
          <!-- Header con título y filtro -->
          <div class="exclusive-collection__header">
            <div class="row align-items-center">
              <div class="col-9">
                <p class="exclusive-collection__title">${this.data.title}</p>
              </div>
              <div class="col-3 text-end position-relative" id="filter-container">
                <p class="exclusive-collection__filter-trigger ${this.isFilterOpen ? 'exclusive-collection__filter-trigger--active' : ''}" id="filter-trigger">
                  ${this.data.allPropertiesLabel}
                  ${activeFiltersCount > 0 ? `<span class="exclusive-collection__active-filters">${activeFiltersCount}</span>` : ''}
                  <span class="exclusive-collection__filter-icon">▼</span>
                </p>

                <!-- Popup de filtros -->
                <div class="filter-popup ${this.isFilterOpen ? 'filter-popup--active' : ''}" id="filter-popup">
                  <div class="filter-popup__header">
                    Filtrar Propiedades
                  </div>

                  <!-- Sección: Rango de Precio -->
                  <div class="filter-popup__section">
                    <div class="filter-popup__section-title">
                      Rango de Precio
                    </div>
                    
                    <div class="filter-popup__option ${this.filters.priceRange === 'all' ? 'filter-popup__option--active' : ''}" data-price-option="all">
                      <input type="radio" class="filter-popup__option-input" name="priceRange" value="all" ${this.filters.priceRange === 'all' ? 'checked' : ''}>
                      <label class="filter-popup__option-label">Todos los precios</label>
                    </div>

                    <div class="filter-popup__option ${this.filters.priceRange === 'lowest' ? 'filter-popup__option--active' : ''}" data-price-option="lowest">
                      <input type="radio" class="filter-popup__option-input" name="priceRange" value="lowest" ${this.filters.priceRange === 'lowest' ? 'checked' : ''}>
                      <label class="filter-popup__option-label">Precio más bajo primero</label>
                    </div>

                    <div class="filter-popup__option ${this.filters.priceRange === 'highest' ? 'filter-popup__option--active' : ''}" data-price-option="highest">
                      <input type="radio" class="filter-popup__option-input" name="priceRange" value="highest" ${this.filters.priceRange === 'highest' ? 'checked' : ''}>
                      <label class="filter-popup__option-label">Precio más alto primero</label>
                    </div>
                  </div>

                  <!-- Sección: Destinos -->
                  <div class="filter-popup__section">
                    <div class="filter-popup__section-title">
                      Por Destino
                    </div>
                    
                    ${uniqueDestinations.map(destination => `
                      <div class="filter-popup__option ${this.filters.destinations.includes(destination) ? 'filter-popup__option--active' : ''}" data-destination="${destination}">
                        <input type="checkbox" class="filter-popup__option-input" value="${destination}" ${this.filters.destinations.includes(destination) ? 'checked' : ''}>
                        <label class="filter-popup__option-label">${destination}</label>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Acciones -->
                  <div class="filter-popup__actions">
                    <button class="filter-popup__button filter-popup__button--clear" id="clear-filters">
                      Limpiar
                    </button>
                    <button class="filter-popup__button filter-popup__button--apply" id="apply-filters">
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <p class="exclusive-collection__subtitle">${this.data.subtitle}</p>
              </div>
            </div>
          </div>

          <!-- Grid de propiedades -->
          <div class="row" id="properties-grid">
            ${this.renderProperties()}
          </div>
        </div>
      </div>
    `;
  }

  renderProperties() {
    if (this.filteredProperties.length === 0) {
      return `
        <div class="col-12 text-center py-5">
          <p style="color: #666; font-size: 1.125rem;">
            No se encontraron propiedades con los filtros seleccionados.
          </p>
        </div>
      `;
    }

    return this.filteredProperties.map(property => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="property-card">
          <div class="property-card__inner">
            <div class="property-card__image-wrapper">
              <img src="${property.image}" alt="${property.title}" class="property-card__image">
              <span class="property-card__badge">${property.destination}</span>
            </div>
            
            <div class="property-card__content">
              <h3 class="property-card__title">${property.title}</h3>
              <p class="property-card__description">${property.description}</p>
              
              <div class="property-card__details">
                <div class="property-card__detail">
                  <span class="property-card__detail-label">Habitaciones</span>
                  <span class="property-card__detail-value">${property.bedrooms}</span>
                </div>
                <div class="property-card__detail">
                  <span class="property-card__detail-label">Baños</span>
                  <span class="property-card__detail-value">${property.bathrooms}</span>
                </div>
                <div class="property-card__detail">
                  <span class="property-card__detail-label">Pies²</span>
                  <span class="property-card__detail-value">${property.sqft.toLocaleString()}</span>
                </div>
              </div>
              
              <div class="property-card__price">${this.formatPrice(property.price)}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  attachEventListeners() {
    // Toggle filter popup
    const filterTrigger = document.getElementById('filter-trigger');
    filterTrigger?.addEventListener('click', () => {
      this.isFilterOpen = !this.isFilterOpen;
      this.render();
      this.attachEventListeners();
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      const filterContainer = document.getElementById('filter-container');
      if (this.isFilterOpen && filterContainer && !filterContainer.contains(e.target)) {
        this.isFilterOpen = false;
        this.render();
        this.attachEventListeners();
      }
    });

    // Price range options
    const priceOptions = document.querySelectorAll('[data-price-option]');
    priceOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const value = option.getAttribute('data-price-option');
        this.filters.priceRange = value;
        this.updateActiveStates();
      });
    });

    // Destination checkboxes
    const destinationOptions = document.querySelectorAll('[data-destination]');
    destinationOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const destination = option.getAttribute('data-destination');
        const checkbox = option.querySelector('input[type="checkbox"]');
        
        if (this.filters.destinations.includes(destination)) {
          this.filters.destinations = this.filters.destinations.filter(d => d !== destination);
          checkbox.checked = false;
        } else {
          this.filters.destinations.push(destination);
          checkbox.checked = true;
        }
        
        this.updateActiveStates();
      });
    });

    // Apply filters button
    const applyBtn = document.getElementById('apply-filters');
    applyBtn?.addEventListener('click', () => {
      this.applyFilters();
    });

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters');
    clearBtn?.addEventListener('click', () => {
      this.clearFilters();
    });
  }

  updateActiveStates() {
    // Update price options
    document.querySelectorAll('[data-price-option]').forEach(option => {
      const value = option.getAttribute('data-price-option');
      if (value === this.filters.priceRange) {
        option.classList.add('filter-popup__option--active');
        option.querySelector('input').checked = true;
      } else {
        option.classList.remove('filter-popup__option--active');
        option.querySelector('input').checked = false;
      }
    });

    // Update destination options
    document.querySelectorAll('[data-destination]').forEach(option => {
      const destination = option.getAttribute('data-destination');
      if (this.filters.destinations.includes(destination)) {
        option.classList.add('filter-popup__option--active');
      } else {
        option.classList.remove('filter-popup__option--active');
      }
    });
  }

  applyFilters() {
    let filtered = [...this.data.properties];

    // Filter by price
    if (this.filters.priceRange === 'lowest') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.filters.priceRange === 'highest') {
      filtered.sort((a, b) => b.price - a.price);
    }

    // Filter by destinations
    if (this.filters.destinations.length > 0) {
      filtered = filtered.filter(property => 
        this.filters.destinations.includes(property.destination)
      );
    }

    this.filteredProperties = filtered;
    this.isFilterOpen = false;
    this.render();
    this.attachEventListeners();
  }

  clearFilters() {
    this.filters = {
      priceRange: 'all',
      destinations: []
    };
    this.filteredProperties = [...this.data.properties];
    this.isFilterOpen = false;
    this.render();
    this.attachEventListeners();
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Cargar datos del JSON
    const response = await fetch('/data/home.json');
    const data = await response.json();
    
    // Inicializar componente
    new ExclusiveCollection('exclusive-collection-root', data.exclusiveCollection);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});