import React from 'react';
import ReactDOM from 'react-dom';
import { Router,
    Route,
    Link,
    IndexLink,
    IndexRoute,
    hashHistory
} from 'react-router';
import '../scss/main.scss';
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    FaAnchor
} from "react-google-maps";
import ReactModal from 'react-modal';


function App(){
    return (
            <Router history={hashHistory}>
                <Route path='/' component={MainTemplate}>
                    <IndexRoute component={Main} />
                    {/*Contact - this way all the previous search results for a user will be lost*/}
                    {/*2nd opt - cover main component with pop-up*/}
                    <Route path='contact' component={Contact}/>
                    <Route path='*' component={NotFound} />
                </Route>
            </Router>
        )
}

class MainTemplate extends React.Component{
    render(){
        return <div>
                    {this.props.children}
                    <Footer />
                </div>
    }
}

class Main extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            //fetched data with all atr per city
            attrPerCity: null,
            //selection among 3 types: attractions, playgrounds, baby_changing_st
            type: null,
            //toogle between min age and show all
            min_age: 14,
            //is raining opt
            isRaining: false,
            //rating selection
            rating: null,
            //filtered list
            selectionList: null,
            //city's lat & lng
            cityLat: null,
            cityLng: null
        }
    }

    render(){
        return <div className="background_img" style={{background: "url('src/img/banana_pattern.jpg')no-repeat center /cover"}}>

                    <MainSearch
                        getCityId={this.setCityId}
                        getAttrType={this.setAttrType}
                        getMinAge={this.setMinAge}
                        getShowAllAttr={this.setShowAllAttr}
                        getIsRainingCond={this.setIsRainingCond}
                        getRating={this.setRating}
                        selectionList={this.state.selectionList}
                    />

                    <DisplayResults list={this.state}/>
                </div>
    }

    setCityId = (cityId) =>{
        this.AttractionsPerCityId(cityId);
    }

    setAttrType = (type) =>{
        this.setState({
            type: type,
            selectionList: this.getSelectionList(type, this.state.attrPerCity)
        });
    }

    AttractionsPerCityId(id){

        console.log("Prosze czekac, laduje wybrane przez ciebie atrakcje ....");
        //zmienic stan na loading

        fetch('http://localhost:3000/city/'+ id)
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    attrPerCity: data,
                    cityLat: Number(data.lat),
                    cityLng: Number(data.lng),
                    selectionList: this.getSelectionList(this.state.type, data)
                })
            });
    }

    getSelectionList(type, attrPerCity){
        if(type === 'attractions') return attrPerCity.attractions;
        if(type === 'playgrounds') return attrPerCity.playgrounds;
        if(type === 'baby_changing_st') return attrPerCity.baby_changing_st;
        return null;
    }

    setIsRainingCond = (condition) =>{
        this.setState({isRaining: condition});
    }

    setMinAge = (age) =>{
        this.setState({min_age: age});
    }
    setShowAllAttr =(param)=>{
        param && this.setState({min_age: 14});
    }

    setRating = (rating) =>{
        this.setState({rating: rating});
    }
}

class MainSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            attractions: null,
            isCitySelected: false,
            isAttrSelected: false
        }
    }
    render(){
        return <div>
                    <div className="container" >
                        <div className="search">
                            <img id="img_logo" src="src/img/monkey_logo_text.png" alt="logo" />
                        </div>
                        <div className="search">
                            <p>Znajdz najlepsze atrakcje dla dzieci w twojej okolicy, nawet gdy za oknem pada deszcz. </p>
                        </div>
                    </div>

                    <div className="container">
                        <CitySearch
                            attractions={this.state.attractions}
                            getCityId={this.getCityId} />

                        <AttractionsSearch
                            getAttrType={this.getAttrType}
                            style={this.state.isCitySelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

                        <IsRainingOption
                            getIsRainingCond={this.getIsRainingCond}
                            style={this.state.isAttrSelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

                        <ByAgeSearch
                            getMinAge={this.getMinAge}
                            getShowAllAttr={this.getShowAllAttr}
                            style={this.state.isAttrSelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

                        <FilterOpt
                            getRating={this.getRating}
                            style={this.state.isAttrSelected? {visibility: 'visible'} : {visibility: 'hidden'}}/>
                    </div>
                </div>
    }

    componentDidMount() {
        fetch('http://localhost:3000/city')
            .then(resp => resp.json())
            .then(data => {
                this.setState({attractions: data})});

    }

    getCityId = (param) =>{
        typeof(this.props.getCityId) === 'function' && this.props.getCityId(param);
        this.setState({isCitySelected: true});
    }

    getAttrType = (param) =>{
        this.state.isCitySelected && (typeof(this.props.getAttrType) === 'function' && this.props.getAttrType(param));
        this.setState({isAttrSelected: true});
    }

    getIsRainingCond = (param) =>{
        this.state.isCitySelected && (typeof(this.props.getIsRainingCond) === 'function' && this.props.getIsRainingCond(param));
    }

    getMinAge = (param) =>{
        this.state.isAttrSelected && typeof(this.props.getMinAge) === 'function' && this.props.getMinAge(param);
    }
    getShowAllAttr = (param) =>{
        typeof(this.props.getShowAllAttr) === 'function' && this.props.getShowAllAttr(param);
    }

    getRating = (param) =>{
        this.state.isAttrSelected && typeof(this.props.getRating) === 'function' && this.props.getRating(param);
    }
}

class CitySearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            city: null
        }
    }
    render(){
        if(!this.props.attractions)
            return null;

        let cityList = this.props.attractions.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)).map(c => <li key={c.id} value={c.name} onClick={() => this.setCityId(c.name, c.id)}>{c.name}</li>);

        return <div className="search"><span>Wybierz miasto:</span>
                    <div><img src="/src/img/loupe.png" alt="search_loupe" />
                        {this.state.city == null? 'Wybierz miasto' : this.state.city}</div>
                    <ul>
                        {cityList}
                    </ul>
                </div>
    }

    setCityId = (city, id) =>{
        this.setState({city: city});
        typeof(this.props.getCityId) === 'function' && this.props.getCityId(id);
    }
}

class AttractionsSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputs: [
                {value: 'attractions', text: 'Atrakcje'},
                {value: 'playgrounds', text: 'Place Zabaw'},
                {value: 'baby_changing_st', text: 'Przewijak'}],
            selection: null
        }
    }
    render(){
        return <div className="search" style={this.props.style}><span>Czego szukasz?</span>
                    <div><img src="/src/img/loupe.png" alt="search_loupe" />
                        {this.state.selection == null? 'Wybierz z listy' : this.state.selection}</div>
                    <ul>
                        {this.state.inputs.map((el, i) => <li key={i}
                                                             value={el.value}
                                                             onClick={() => this.setAttrType(el.value, el.text)}>
                                                            {el.text}
                                                        </li>)}
                    </ul>
                </div>
    }
    setAttrType = (val, selection) =>{
        this.setState({selection: selection});
        typeof(this.props.getAttrType) === 'function' && this.props.getAttrType(val);
    }
}

class IsRainingOption extends React.Component{
    render(){
        return <div className="search" style={this.props.style}><span>Pada deszcz? </span>
            <div>
                <input type='checkbox'
                       style={{width: '2.5rem', height: '2.5rem'}}
                       onChange={(e) => this.isRaining(e.target.checked)}></input> <img src="/src/img/rain_cloud.png"
                                                                                        alt="rain"
                                                                                        style={{width: '3.3rem', height: '3.3rem'}} /> Tak
            </div>
        </div>
    }
    isRaining =(e)=>{
        typeof(this.props.getIsRainingCond) === 'function' && this.props.getIsRainingCond(e);
    }
}

class ByAgeSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: 0,
            isChecked: true,
        }
    }

    render(){
        return  <div className="search" style={this.props.style}>

                    <p>Wszystkie atrakcje: </p>
                    <div>
                        <input id='age_all'
                               type="checkbox"
                               value={this.state.isChecked}
                               onChange={this.handleCheckbox}
                               checked={this.state.isChecked? true : false}
                               style={{width: '2.5rem', height: '2.5rem'}}
                    /></div>

                    <p> Okresl wiek pociechy: </p>
                    <div>
                        <input id='age_sel'
                               type="checkbox"
                               value={!this.state.isChecked}
                               onChange={this.handleCheckbox}
                               checked={!this.state.isChecked? true : false}
                               style={{width: '2.5rem', height: '2.5rem'}}
                        /></div>

                    <div style={this.state.isChecked? {visibility: 'hidden'} : {visibility: 'visible'}}>
                        <span>Okolo: </span><input type="range"
                                                min="0"
                                                max="14"
                                                value={this.state.value}
                                                onChange={(e) => this.handleSlide(e.target.value)} />
                        <p>ok. {this.state.value == 0 && this.state.value < 1 ? this.state.value + ' lat' :
                            this.state.value <= 1 && this.state.value > 0? this.state.value + ' roku' :
                            this.state.value >= 2 && this.state.value + ' lat'} </p>
                    </div>

                </div>
    }

    handleSlide = (e) =>{
        this.setState({value: e}, () => this.setState({isChecked: false}));
        typeof(this.props.getMinAge) === 'function' && this.props.getMinAge(e);
    }

    handleCheckbox = () =>{
        this.setState({isChecked: !this.state.isChecked},
            () => typeof(this.props.getShowAllAttr) === 'function' && this.props.getShowAllAttr(this.state.isChecked));

        typeof(this.props.getMinAge) === 'function' && this.props.getMinAge(this.state.value);
    }
}

class FilterOpt extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputs: Array(5).fill({}).map((_, i) => ({val: i+1, isChecked: false}))
        }
    }

    render(){
        const inputs = this.state.inputs.map(el=> <div key={el.val}>
                                                    {el.val === 1? 'wszystkie' : el.val+'+'}
                                                        <input type="checkbox"
                                                               value={el.val}
                                                               onChange={() => this.handleCheckmark(el.val)}
                                                               checked={el.isChecked}
                                                               style={{width: '2.5rem', height: '2.5rem'}} />
                                                </div>);

        return <div className="search" style={this.props.style}>
            <p>Filtruj po ocenie: </p>
                    {inputs}
                </div>
    }

    handleCheckmark = (id) =>{
        this.setState(prevState => ({inputs: prevState.inputs.map(el => ({val: el.val, isChecked: el.val === id}))}),
            () => this.sendRating(id));
    }
    sendRating(val){
        typeof(this.props.getRating) === 'function' && this.props.getRating(val);
    }
}

class DisplayResults extends React.Component{
    render(){
        const listToDisplay = this.props.list.type != null &&
                // this.props.list.type == 'baby_changing_st'?
                //     this.props.list.selectionList :
                    this.props.list.selectionList != null
                    && this.props.list.selectionList.filter(e => this.props.list.isRaining?
                        e.indoor == this.props.list.isRaining && this.props.list.min_age >= Number(e.age_from) && e.rating >= this.props.list.rating :
                        e && this.props.list.min_age >= Number(e.age_from) && e.rating >= this.props.list.rating).sort((a,b) => (b.age_from > a.age_from) ? 1 : ((a.age_from > b.age_from) ? -1 : 0));

        return <div>
                    {!this.props.list.selectionList? null : <ListDisplay list={listToDisplay} type={this.props.list.type} />}
                    {!this.props.list.selectionList? null : <MapDisplay list={listToDisplay}
                                                                        cityLat={this.props.list.cityLat}
                                                                        cityLng={this.props.list.cityLng}/>}
        </div>
    }
}


class ListDisplay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            elements: this.props.list.map(el => ({id: el.id, isSelected: false})),
            listOfSelected: []
        }
    }

    render(){
        return <div>

                {/*<FaveList faves={this.state.listOfSelected} list={this.props.list} />*/}

                <div className="container attr_list" >

                <div>Skrot do mapy</div>

                    {!this.props.list? null :
                        this.props.list.map((el, i) =>
                            <div key={i}>

                                <div className='display_box'>

                                    <div className='box_img'>

                                        <PopUp img={<img className='thumbnail'
                                                         src={el.main_pic}
                                                         alt="pic"
                                                         height='255rem'
                                                         width='255rem'
                                                         style={{borderRadius: '1rem', cursor: 'pointer'}} />}
                                               attraction={this.props.list[i]}
                                               type={this.props.type}
                                               icons={<Icons type={this.props.type}
                                                             attraction={this.props.list[i]}
                                                             fave={<Fave value={el.id}
                                                                         onClick={() => this.addToFave(el.id)}
                                                                         isSelected={this.state.listOfSelected.indexOf(el.id) > -1}/>}/>}/>

                                    </div>

                                    <div className='box_text'>

                                        <PopUp h3={<div style={{cursor: 'pointer', marginTop: '.5rem', fontSize: '2rem'}}><b>{el.name}</b></div>}
                                               attraction={this.props.list[i]}
                                               type={this.props.type}
                                               icons={<Icons type={this.props.type}
                                                             attraction={this.props.list[i]}
                                                             fave={<Fave value={el.id}
                                                                         onClick={() => this.addToFave(el.id)}
                                                                         isSelected={this.state.listOfSelected.indexOf(el.id) > -1}/>}/>}/>

                                        <p style={{marginTop: '.2rem'}}>{el.address}, <b>{el.city}</b></p> <br />

                                        <p style={{color: 'red'}}><b>{el.date_from === ''? null :
                                            el.date_from == el.date_till? 'Atrakcja dostepna: ' + el.date_from :
                                                'Attrakcja dostepna od: '+ el.date_from +' do: ' + el.date_till}</b></p>

                                        {el.age_from === ''? <p style={{height: '1.6rem'}} />:
                                            <p>Wiek, od: <b>{el.age_from} {Number(el.age_from) < 2? 'roku' : 'lat'}</b></p>}


                                        {el.time_min === ''? <p style={{height: '1.6rem'}}> </p> :
                                            <p>Minimalny czas atrakcji: <b>{el.time_min} min</b></p>}<br />

                                        <p>{el.description}</p>

                                        {el.description === ''? null:
                                            <PopUp link={
                                                <a href="" style={{cursor: 'pointer'}}>...czytaj wiecej  </a>}
                                                   attraction={this.props.list[i]}
                                                   type={this.props.type}
                                                   icons={<Icons type={this.props.type}
                                                                 attraction={this.props.list[i]}
                                                                 fave={<Fave value={el.id}
                                                                             onClick={() => this.addToFave(el.id)}
                                                                             isSelected={this.state.listOfSelected.indexOf(el.id) > -1}/>}/>}/>}

                                        <div>
                                            {el.website === ''? null :
                                                <span style={{marginLeft: '.5rem'}}> lub odwiedz strone: </span>}
                                            {el.website === ''? <p style={{height: '1.6rem'}}/> :
                                                <a href={el.website} target="_blank">{el.website}</a>}
                                        </div>

                                        <br />
                                        <hr />

                                        <div className='icons' style={el.date_from === ''? {margin: '2rem 0 0 0'} : {}}>

                                            <Fave value={el.id}
                                                      onClick={() => this.addToFave(el.id)}
                                                      isSelected={this.state.listOfSelected.indexOf(el.id) > -1}/>

                                            <Icons type={this.props.type} attraction={this.props.list[i]}/>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                </div>
    }
    addToFave = (id) =>{
        this.state.listOfSelected.indexOf(id) != -1?
            this.removeDuplicates(this.state.listOfSelected, this.state.listOfSelected.indexOf(id)) :
            this.setState(prevState => ({listOfSelected: [...prevState.listOfSelected, id]}),
                () => this.markFave(this.state.listOfSelected));
    }
    markFave(array){
        console.log([...array]);
        this.setState(prevState => ({elements: prevState.elements.map(el =>({
                                                                                id: el.id,
                                                                                isSelected: array.indexOf(el.id)!= -1? true : false
        }))}));
    }
    removeDuplicates(array, index){
        array.splice(index, 1);
        this.setState({listOfSelected: [...array]}, () => this.markFave(this.state.listOfSelected));
    }
}

class FaveList extends React.Component{
    render(){
        
        // const listOfFaves = this.props.list !== null &&
        //     this.props.faves !== null

        return <div>
            <span>Lista Ulubionych</span>
            {this.props.faves.map(el => <p key={el}>{this.props.list[`${el}`].name}</p> )}
        </div>
    }
}

class PopUp extends React.Component {
    constructor () {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal (e) {
        e.preventDefault();
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render () {
        return (
            <div>
                <div onClick={this.handleOpenModal}>{this.props.img} {this.props.h3} {this.props.link}</div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example">

                    <button onClick={this.handleCloseModal}
                            style={{width: '3rem', height: '3rem'}}>X</button>

                    <div className="container" style={{background: 'white'}}>
                        {!this.props.attraction? null:

                            <div className='reactModalView'
                                 key={this.props.attraction.id}
                                 style={{fontFamily: "Arial, Helvetica, sans-serif"}}>

                                <h3 style={{color: 'grey'}}>{this.props.attraction.name}</h3>

                                <p>{this.props.attraction.address}, <b>{this.props.attraction.city}</b></p>

                                <p style={{color: 'red'}}><b>{this.props.attraction.date_from === ''? null :
                                    this.props.attraction.date_from == this.props.attraction.date_till? 'Atrakcja dostepna: ' + this.props.attraction.date_from :
                                        'Attrakcja dostepna od: '+ this.props.attraction.date_from +' do: ' + this.props.attraction.date_till}</b></p>

                                <br />

                                <div className="slideshow-container">

                                    {this.props.type !== 'baby_changing_st'?
                                        <PicCarusel pictures={this.props.attraction.pictures} /> :
                                        null}

                                </div>

                                <br />

                                {this.props.attraction.age_from === ''? <p style={{height: '1.6rem'}} />:
                                    <p>Wiek, od: <b>{this.props.attraction.age_from} {Number(this.props.attraction.age_from) < 2? 'roku' : 'lat'}</b></p>}

                                {this.props.type === 'playgrounds' && this.props.attraction.gated?
                                    <div style={{marginTop: '.5rem'}}>Ogrodzony: <b>Tak</b></div> :
                                    <div style={{marginTop: '.5rem'}}>Ogrodzony: <b>Nie</b></div>}

                                {this.props.type === 'playgrounds' && this.props.attraction.fee?
                                    <div style={{marginTop: '.5rem'}}>Bezplatny: <b>Nie</b></div> :
                                    <div style={{marginTop: '.5rem'}}>Bezplatny: <b>Tak</b></div>}

                                {this.props.attraction.time_min === ''? <p style={{height: '1.6rem'}}> </p> :
                                    <p>Minimalny czas atrakcji: <b>{this.props.attraction.time_min} min</b></p>}
                                    <br />

                                <hr />

                                <div>
                                     {this.props.fave}
                                     {this.props.icons}</div>

                                <br />
                                <hr />
                                <br />

                                <div>
                                    {this.props.attraction.full_description}
                                </div>

                                <br />
                                <div>
                                    {this.props.attraction.website === ''? null :
                                        <span> Odwiedz strone: </span>}
                                    {this.props.attraction.website === ''? <p style={{height: '1.6rem'}}/> :
                                        <a href={this.props.attraction.website} target="_blank">{this.props.attraction.website}</a>}
                                </div>


                            </div>}

                    </div>
                </ReactModal>
            </div>
        );
    }
}

class PicCarusel extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            elements: this.props.pictures.map((_, i) => ({
                id: i,
                isSelected: false
            })),
            start: 0
        }
    }
    render(){
        return <div>
            {this.props.pictures.map((el, i) => <div className="mySlides fade"
                                                     key={i}
                                                     style={this.state.elements[i].isSelected?
                                                                            {display: 'block'} :
                                                                            {display: 'none'}}>
            <div className="carusel_pic"
                 style={{backgroundImage: `url(${el})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} />
            <div className="text">Caption Text</div>
        </div>)}

            <a className="prev" onClick={() => this.plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => this.plusSlides(1)}>&#10095;</a>
        </div>
    }
    componentDidMount(){
        this.showSlides(this.state.start);
    }
    showSlides(n){

        n > this.props.pictures.length-1 && this.setState({start: 0}, ()=> this.showSlides(0));
        n < 0 && this.setState({start: this.props.pictures.length}, () => this.showSlides(this.props.pictures.length -1));

        this.setState(prevState => ({
            elements: prevState.elements.map(el => ({
                id: el.id,
                isSelected: el.id === n
            }))
        }));
    }
    plusSlides = (val) =>{
        this.setState(prevState => ({start: prevState.start + val}), this.showSlides(this.state.start + val));
    }
}

class Fave extends React.Component{
    render(){
        return <div className='tooltip'>
                    <img src={this.props.isSelected? 'src/img/heart.png' : 'src/img/heart_add.png'}
                         alt={this.props.isSelected? 'on_fave_list' : 'add_to_list'}
                         onClick={this.props.onClick}
                         style={{cursor: 'pointer'}}/>
                    <span className='tooltiptext'>{this.props.isSelected? 'Ulubione' : 'Dodaj'}</span>
                </div>
    }
}

class Icons extends React.Component{
    render(){
        return <div className='icons'>
            {this.props.fave}
            {this.props.attraction.age_from === ''?
                null:
                <div className='age tooltip'>
                    <span>{this.props.attraction.age_from}+</span>
                    <span className='tooltiptext'>Wiek</span>
                </div>}

            {this.props.type === 'baby_changing_st'?
                null :
                this.props.attraction.indoor ?
                    <div className='weather tooltip'>
                        <img src='https://cdn3.iconfinder.com/data/icons/logistics/256/Keep_Dry_Symbol-512.png'
                             alt='umbrella'
                             style={{width: '3.5rem', height: '3.5rem'}}  />
                        <span className='tooltiptext'>Atrakcja wewnatrz</span>
                    </div> :
                    <div className='weather tooltip'>
                        <img src='src/img/sun.png'
                             alt='sun'
                             style={{width: '3.5rem', height: '3.5rem'}} />
                        <span className='tooltiptext'>Atrakcja na zewnatrz</span>
                    </div>}

            <div className='rating tooltip'>
                <span>Ocena: {this.props.attraction.rating? this.props.attraction.rating + '+' : null}</span>
                {Number(this.props.attraction.rating) === 1? <div><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                    Number(this.props.attraction.rating) === 2? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                        Number(this.props.attraction.rating) === 3? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                            Number(this.props.attraction.rating) === 4? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                Number(this.props.attraction.rating) === 5 ? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                    Number(this.props.attraction.rating) === 0 && null}
            </div>

        </div>
    }
}


class MapDisplay extends React.PureComponent {
    constructor(props){
        super(props);

        this.state = {
            markers: this.props.list.map(el => ({
                id: el.id,
                position: {
                    lat: Number(el.lat),
                    lng: Number(el.lng)},
                text: el.name,
                isOpen: false,
                })),
            cityLat: this.props.cityLat,
            cityLng: this.props.cityLng
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.cityLat !== prevProps.cityLat || this.props.cityLng !== prevProps.cityLng || this.props.list !== prevProps.list){
            this.setState({
                markers: this.props.list.map(el => ({id: el.id, position: {lat: Number(el.lat), lng: Number(el.lng)}, text: el.name, isOpen: false, indoor: el.indoor, age_from: el.age_from})),
                cityLat: this.props.cityLat,
                cityLng: this.props.cityLng
            })
        }
    }

    handleMarkerClick = (id) => {
        console.log('Map Disaplay, marker id: ', id);
        this.setState(prevState => ({
            markers: prevState.markers.map(m => {
                if (m.id === id) {
                    m.isOpen = true;
                } else {
                    m.isOpen = false;
                }
                return m;
            })
        }));
    }

    render() {
        return (
            <div className="container">
                <MapComponent
                    center={this.state}
                    markers={this.state.markers}
                    onMarkerClick={this.handleMarkerClick}
                />
            </div>
        )
    }
}


const MapComponent = compose(
    withProps({
        // googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2sDQZ-36NLlY4iMvoiuQ7mS1n-v8iq2M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{height: `500px`, width: '150rem'}} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={13}
        center={{ lat: props.center.cityLat, lng: props.center.cityLng }}>
        {props.markers.map(m => (
            <Marker key={m.id} onClick={() => props.onMarkerClick(m.id)} position={m.position}>
                {m.isOpen && (
                    <InfoWindow>
                        <div>{m.text}</div>
                    </InfoWindow>
                )}
            </Marker>
        ))}
    </GoogleMap>
)


class Contact extends React.Component{
    render(){
        return <div>Kontakt</div>
    }
}

class Footer extends React.Component{
    render(){
        return <footer>
                    <div className="container">
                        <nav>
                            <Link to="/" className="active">Start</Link>
                            <Link to="/contact">Kontakt</Link>
                        </nav>
                    </div>
                    <Credits />
                </footer>
    }
}

function Credits(){
    return (
        <div>
            {/*<a href="https://www.freepik.com/free-vector/birthday-card-with-monkey-design_1172469.htm">Designed by Freepik</a>*/}
            {/*<a href="https://www.freepik.com/free-photo/banana-pattern_2209102.htm">Designed by Freepik</a>*/}
            {/*<a href="https://www.flaticon.com/free-icon/circus-monkey_109118">Designed by FlatIcon</a>*/}
        </div>
    )
}

class NotFound extends React.Component {
    render() {
        return <h1>404,Nothing is here</h1>;
    }
}

document.addEventListener('DOMContentLoaded', function(){

    ReactModal.setAppElement('#app');

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});