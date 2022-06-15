import React, { Component } from 'react';

import MarvelService from '../../services/MarvelService';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

import propTypes from 'prop-types';

class CharList extends Component {
    state = {
        char: [],
        error: false,
        loading: true,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    itemRefs = []; // Arr items

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    onCharLoaded = (newChar) => {
        let ended = false;

        if (newChar.length < 9) {
            ended = true;
        }

        this.setState(({offset, char}) => ({
            char: [...char, ...newChar],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }));
    }

    focusOnItem = id => {
        // remove class
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        // add class for id
        this.itemRefs[id].classList.add('char__item_selected');
        // focus on class
        this.itemRefs[id].focus();
    }

    setRef = ref => {
        this.itemRefs.push(ref)
    }

    renderItems (arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit' : 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit' : 'unset' };
            }

            return (
                <li className='char__item'
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
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

    render() {
        const {char, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(char);

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
                    onClick={() => this.onRequest(offset)} >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: propTypes.func.isRequired
}

export default CharList;