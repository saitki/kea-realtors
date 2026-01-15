import MetersIcon from "../icons/MetersIcon";
import BedIcon from "../icons/BedIcon";
import BathIcon from "../icons/BathIcon";
import GarageIcon from "../icons/GarageIcon";

export const PropertyCard = ({
  id,
  image,
  title,
  locate,
  sqft,
  bedrooms = 0,
  bathrooms = 0,
  garage = 0,
  price,
  badgeText = "Pre-Venta",
  href = "#",
  formatNumber,
}) => {
  return (
    <div key={id} className="col-12 col-md-4">
      <a href={href} className="text-decoration-none">
        <div className="card h-80 property-card border-0 rounded-2">
          {/* Media */}
          <div className="property-card__media">
            <img
              src={image}
              alt={title}
              className="card-img"
              loading="lazy"
              decoding="async"
            />
            {badgeText && (
              <span className="property-card__badge">{badgeText}</span>
            )}
          </div>
          {/* Body */}
          <div className="card-body property-card__body">
            <h5 className="property-card__title">{title}</h5>
            <p className="property-card__city">{locate}</p>
            {/* Features */}
            <div className="property-card__features">
              <div className="row align-items-center">
                {/* Metros cuadrados */}
                <div className="col-8 d-flex align-items-center gap-2 property-amenity">
                  <MetersIcon />
                  <span>{sqft.toLocaleString()} m²</span>
                </div>
                {/* Amenidades */}
                <div className="col-4 d-flex justify-content-end">
                  <div className="property-amenities d-flex align-items-center gap-3">
                    {bedrooms > 0 && (
                      <div className="property-amenities__item">
                        <BedIcon />
                        <span>{bedrooms}</span>
                      </div>
                    )}
                    {bathrooms > 0 && (
                      <div className="property-amenities__item">
                        <BathIcon />
                        <span>{bathrooms}</span>
                      </div>
                    )}
                    {garage > 0 && (
                      <div className="property-amenities__item">
                        <GarageIcon />
                        <span>{garage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-divider"></div>
            {/* Price */}
            <p className="property-card__price">
              Desde {formatNumber(price)} US
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};
