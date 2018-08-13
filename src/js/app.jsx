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
            elements: this.props.list.map(el => ({id: el.id, isSelected: false}))
        }
    }

    render(){

        return <div className="container attr_list" >
                <div>Skrot do mapy</div>
                    {!this.props.list? null :
                        this.props.list.map((el, i) =>
                            <div key={i}>
                                <div className='display_box'>

                                    <div className='box_img'>
                                        <PopUp img={<img className='thumbnail'
                                                         src={el.pictures}
                                                         alt="pic"
                                                         height='255rem'
                                                         width='255rem'
                                                         style={{borderRadius: '1rem', cursor: 'pointer'}} />}
                                               attraction={this.props.list[i]} />
                                    </div>

                                    <div className='box_text'>
                                        <PopUp h3={<div style={{cursor: 'pointer', marginTop: '.5rem', fontSize: '2rem'}}><b>{el.name}</b></div>}
                                           attraction={this.props.list[i]} />
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
                                                   attraction={this.props.list[i]} />}
                                        <div>
                                            {el.website === ''? null :
                                                <span> lub odwiedz strone: </span>}
                                            {el.website === ''? <p style={{height: '1.6rem'}}/> :
                                                <a href={el.website} target="_blank">{el.website}</a>}
                                        </div>
                                        <br />
                                        <hr />
                                        <div className='icons' style={el.date_from === ''? {margin: '2rem 0 0 0'} : {}}>
                                            {this.state.elements[i].isSelected? <div className='tooltip'>
                                                                                    <img value={i}
                                                                                         src='src/img/heart.png'
                                                                                         alt='on_fave_list'
                                                                                         onClick={(e) => this.addToFave(e, el.id)}
                                                                                         style={{cursor: 'pointer'}}/>
                                                                                    <span className='tooltiptext'>na liscie Ulubionych</span></div> :
                                                <div className='tooltip'>
                                                    <img value={i}
                                                         src='src/img/heart_add.png'
                                                         alt='add_to_list'
                                                         onClick={(e) => this.addToFave(e, el.id)}
                                                         style={{cursor: 'pointer'}}/><span className='tooltiptext'>Dodaj do Ulubionych</span></div>}

                                            {this.props.type === 'baby_changing_st'? null :
                                                el.indoor? <div className='tooltip'>
                                                        <img src='https://cdn3.iconfinder.com/data/icons/logistics/256/Keep_Dry_Symbol-512.png'
                                                             alt='umbrella'
                                                             style={{width: '3.5rem', height: '3.5rem'}}  />
                                                        <span className='tooltiptext'>atrakcja wewnatrz</span>
                                                    </div>:
                                                    <div className='tooltip'>
                                                        <img src='src/img/sun.png'
                                                             alt='sun'
                                                             style={{width: '3.5rem', height: '3.5rem'}} />
                                                        <span className='tooltiptext'>atrakcja na zewnatrz</span>
                                                    </div>}
                                            {el.age_from === ''? null:
                                                <div className='age tooltip'>
                                                    <span>{el.age_from}+</span>
                                                    <span className='tooltiptext'>Wiek</span>
                                                </div>}

                                            <div  className='rating tooltip'>
                                                <span>Ocena: {el.rating? el.rating + '+' : null}</span>

                                                    {Number(el.rating) === 1? <div><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                                        Number(el.rating) === 2? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                                            Number(el.rating) === 3? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                                                Number(el.rating) === 4? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                                                    Number(el.rating) === 5 ? <div><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><img src='src/img/banana.png'></img><span className='tooltiptext'>Ocena</span></div>:
                                                                        Number(el.rating) === 0 && null}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                            </div>
    }
    addToFave = (e, id) =>{
        console.log(id);
        console.log(e);
        this.setState(prevState => ({elements: prevState.elements.map(el => ({id: el.id, isSelected: el.id === id}))}));
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
                            <div key={this.props.attraction.id} style={{fontFamily: "Arial, Helvetica, sans-serif"}}>
                                <img src={this.props.attraction.pictures}
                                     alt="pic"
                                     height='250px'
                                     width='250px'
                                     style={{borderRadius: '10px'}}></img>
                                <h3 style={{color: 'grey'}}>{this.props.attraction.name}</h3>
                                <br/>
                                <p style={{color: 'grey'}}> Wiek: od {this.props.attraction.age_from} {Number(this.props.attraction.age_from) < 2? 'roku' : 'lat'}</p>
                                <p style={{color: 'red'}}>{this.props.attraction.date_from == ''? null :
                                    this.props.attraction.date_from == this.props.attraction.date_till? 'Atrakcja dostepna: ' + this.props.attraction.date_from :
                                        'Attrakcja dostepna od: '+ this.props.attraction.date_from +' do: ' + this.props.attraction.date_till} </p>
                                <img src={this.props.attraction.indoor? 'https://cdn3.iconfinder.com/data/icons/logistics/256/Keep_Dry_Symbol-512.png' :
                                    'data:image/png;base64,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'}
                                     alt="weather_condit_icon"
                                     style={{width: '30px', height: '30px'}} />
                                <p style={{fontSize: '2rem', }}>{this.props.attraction.address}, <b>{this.props.attraction.city}</b></p>
                                <br/>
                                <p style={{fontSize: '1.75rem'}}>Minimalny czas atrakcji: {this.props.attraction.time_min} min</p>
                                <br/>
                                <p style={{fontSize: '1.75rem'}}>{this.props.attraction.full_description}</p>
                                <br/>
                                <a href={this.props.attraction.website}
                                   target="_blank"
                                   style={{fontSize: '1.5rem'}}> {this.props.attraction.website} </a>
                                <br/>
                                <div style={Number(this.props.attraction.rating) === 1? {backgroundColor: 'red', width: '30px', height: '30px'}:
                                    Number(this.props.attraction.rating) === 2? {backgroundColor: 'orange', width: '30px', height: '30px'}:
                                        Number(this.props.attraction.rating) === 3? {backgroundColor: 'yellow', width: '30px', height: '30px'}:
                                            Number(this.props.attraction.rating) === 4? {backgroundColor: '#90EE90', width: '30px', height: '30px'}:
                                                Number(this.props.attraction.rating) === 5 ? {backgroundColor: 'green', width: '30px', height: '30px'}:
                                                    Number(this.props.attraction.rating) === 0 ? {backgroundColor: 'grey', width: '30px', height: '30px'}:
                                                        {}
                                }>{this.props.attraction.rating? this.props.attraction.rating + '+' : null} </div>
                                <button value='Dodaj do Listy'>Dodaj do Listy</button>
                            </div>}
                    </div>
                </ReactModal>
            </div>
        );
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



class MyList extends React.Component{
    render(){
        return <div>Moja Lista Atrakcji</div>
    }
}

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