import React, { useState, useEffect, useRef } from 'react';

import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

import propTypes from 'prop-types';

const CharList = (props) => {

    const [char, setChar] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []) // если пустой array то function выполнится один раз

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const onCharLoaded = (newChar) => {
        let ended = false;

        if (newChar.length < 9) {
            ended = true;
        }

        setChar(char => [...char, ...newChar]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = id => {
        // remove class
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        // add class for id
        itemRefs.current[id].classList.add('char__item_selected');
        // focus on class
        itemRefs.current[id].focus();
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit' : 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit' : 'unset' };
            }

            return (
                <li className='char__item'
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{ item.name }</div>
                </li>
            );
        });

        return (
            <ul className='char__grid'>
                { items }
            </ul>
        );
    }

    const items = renderItems(char);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            { errorMessage }
            { spinner }
            { content }
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)} >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
}

export default CharList;