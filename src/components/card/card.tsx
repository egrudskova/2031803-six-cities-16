import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {CardProps, CardType} from './types.ts';
import {useMakeOfferFavoriteMutation} from '../../store/reducers/api/api.ts';
import {useAppSelector} from '../../hooks/hooks.ts';
import {selectIsAuth} from '../../store/reducers/auth/auth.ts';
import {AppRoute} from '../app/types.ts';

const Card = ({ offer, cardType, handleActiveCardChoice }: CardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const isAuth = useAppSelector(selectIsAuth);
  const { isPremium, previewImage, price, title, type, isFavorite, rating, id } = offer;
  const [makeOfferFavorite] = useMakeOfferFavoriteMutation();

  const handleFavoriteButtonClick = (): void => {
    if (!isAuth) {
      navigate(AppRoute.Login);
    }
    makeOfferFavorite({ id, favoriteStatus: Number(!isFavorite)});
  };

  return (
    <article className={`${cardType}__card place-card`}
      onMouseOver={() => handleActiveCardChoice && handleActiveCardChoice(id)}
      onMouseLeave={() => handleActiveCardChoice && handleActiveCardChoice()}
    >
      {isPremium && <div className="place-card__mark"><span>Premium</span></div>}
      <div className={`${cardType}__image-wrapper place-card__image-wrapper`}>
        <Link to={`/offer/${id}`}>
          {cardType === CardType.Favorite ?
            <img className="place-card__image" src={previewImage} width="150" height="110" alt="Place image"/>
            :
            <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image"/>}
        </Link>
      </div>
      <div className={`${cardType === CardType.Favorite ? 'favorites__card-info' : ''} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button ${isFavorite ? 'place-card__bookmark-button--active ' : ''}button`} type="button"
            onClick={handleFavoriteButtonClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{isFavorite ? 'In' : 'To'} bookmarks</span>
          </button>

        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${rating / 5 * 100}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
};

export default Card;
