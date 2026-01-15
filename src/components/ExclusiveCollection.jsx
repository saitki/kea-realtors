import { useState, useEffect, useRef } from 'react';
import { formatNumber } from "../js/formatNumber";
import { PropertyCard } from "../components/CardExclusiveCollection";

export default function ExclusiveCollection({ data }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(data.properties);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    destinations: []
  });
  const filterRef = useRef(null);

  // Cerrar popup al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...data.properties];

    // Filtrar por precio
    if (filters.priceRange === 'lowest') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.priceRange === 'highest') {
      filtered.sort((a, b) => b.price - a.price);
    }

    // Filtrar por destinos
    if (filters.destinations.length > 0) {
      filtered = filtered.filter(property => 
        filters.destinations.includes(property.destination)
      );
    }

    setFilteredProperties(filtered);
    setIsFilterOpen(false);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      destinations: []
    });
    setFilteredProperties(data.properties);
    setIsFilterOpen(false);
  };

  // Manejar cambio de rango de precio
  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value
    }));
  };

  // Manejar cambio de destinos
  const handleDestinationChange = (destination) => {
    setFilters(prev => {
      const destinations = prev.destinations.includes(destination)
        ? prev.destinations.filter(d => d !== destination)
        : [...prev.destinations, destination];
      
      return {
        ...prev,
        destinations
      };
    });
  };

  // Obtener destinos únicos
  const uniqueDestinations = [...new Set(data.properties.map(p => p.destination))];

  // Contar filtros activos
  const activeFiltersCount = 
    (filters.priceRange !== 'all' ? 1 : 0) + 
    filters.destinations.length;

  return (
    <div className="col-12 col-md-10 mx-auto">
      <div className="exclusive-collection">
        {/* Header con título y filtro */}
        <div className="exclusive-collection__header">
          <div className="row align-items-center">
            <div className="col-9">
              <p className="exclusive-collection__title">{data.title}</p>
            </div>
            <div className="col-3 text-end position-relative" ref={filterRef}>
              <p 
                className={`exclusive-collection__filter-trigger ${isFilterOpen ? 'exclusive-collection__filter-trigger--active' : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {data.allPropertiesLabel}
                {activeFiltersCount > 0 && (
                  <span className="exclusive-collection__active-filters">
                    {activeFiltersCount}
                  </span>
                )}
              </p>
              {/* Popup de filtros */}
              <div className={`filter-popup ${isFilterOpen ? 'filter-popup--active' : ''}`}>
                <div className="filter-popup__header">
                  Filtrar Propiedades
                </div>

                {/* Sección: Rango de Precio */}
                <div className="filter-popup__section">
                  <div className="filter-popup__section-title">
                    Rango de Precio
                  </div>
                  
                  <div 
                    className={`filter-popup__option ${filters.priceRange === 'all' ? 'filter-popup__option--active' : ''}`}
                    onClick={() => handlePriceRangeChange('all')}
                  >
                    <input 
                      type="radio" 
                      className="filter-popup__option-input"
                      checked={filters.priceRange === 'all'}
                      onChange={() => handlePriceRangeChange('all')}
                    />
                    <label className="filter-popup__option-label">
                      Todos los precios
                    </label>
                  </div>

                  <div 
                    className={`filter-popup__option ${filters.priceRange === 'lowest' ? 'filter-popup__option--active' : ''}`}
                    onClick={() => handlePriceRangeChange('lowest')}
                  >
                    <input 
                      type="radio" 
                      className="filter-popup__option-input"
                      checked={filters.priceRange === 'lowest'}
                      onChange={() => handlePriceRangeChange('lowest')}
                    />
                    <label className="filter-popup__option-label">
                      Precio más bajo primero
                    </label>
                  </div>

                  <div 
                    className={`filter-popup__option ${filters.priceRange === 'highest' ? 'filter-popup__option--active' : ''}`}
                    onClick={() => handlePriceRangeChange('highest')}
                  >
                    <input 
                      type="radio" 
                      className="filter-popup__option-input"
                      checked={filters.priceRange === 'highest'}
                      onChange={() => handlePriceRangeChange('highest')}
                    />
                    <label className="filter-popup__option-label">
                      Precio más alto primero
                    </label>
                  </div>
                </div>

                {/* Sección: Destinos */}
                <div className="filter-popup__section">
                  <div className="filter-popup__section-title">
                    Por Destino
                  </div>
                  
                  {uniqueDestinations.map(destination => (
                    <div 
                      key={destination}
                      className={`filter-popup__option ${filters.destinations.includes(destination) ? 'filter-popup__option--active' : ''}`}
                      onClick={() => handleDestinationChange(destination)}
                    >
                      <input 
                        type="checkbox" 
                        className="filter-popup__option-input"
                        checked={filters.destinations.includes(destination)}
                        onChange={() => handleDestinationChange(destination)}
                      />
                      <label className="filter-popup__option-label">
                        {destination}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Acciones */}
                <div className="filter-popup__actions">
                  <button 
                    className="filter-popup__button filter-popup__button--clear"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </button>
                  <button 
                    className="filter-popup__button filter-popup__button--apply"
                    onClick={applyFilters}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <p className="exclusive-collection__subtitle">{data.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Grid de propiedades */}
        <div className="row">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              id={property.id}
              image={property.image}
              title={property.title}
              locate={property.locate}
              sqft={property.sqft}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              garage={property.garage}
              price={property.price}
              badgeText="Pre-Venta"
              href={`/propiedad/${property.id}`}
              formatNumber={formatNumber}
            />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p style={{ color: '#666', fontSize: '1.125rem' }}>
                No se encontraron propiedades con los filtros seleccionados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}