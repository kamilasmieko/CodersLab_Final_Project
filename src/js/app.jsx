import React from 'react';
import ReactDOM from 'react-dom';
import { Router,
    Route,
    Link,
    IndexLink,
    IndexRoute,
    hashHistory
} from 'react-router';

import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

function App(){
    return (
            <Router history={hashHistory}>
                <Route path='/' component={MainComponent}>
                    {/*<Route path='/services/:service' component={ServiceInfo}/>*/}
                    {/*<Route path='*' component={NotFound} />*/}
                </Route>
            </Router>
        )
}


class MainComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            attrPerCity: null,
            type: null,
            min_age: null,
            showAllAttr: true,
            isRaining: false,
            selectionList: null,
            cityLat: null,
            cityLng: null
        }
    }
    render(){
        return <div className="background_img" style={{background: "url('src/img/banana_pattern.jpg')no-repeat center /cover"}}>
                    <MainSearch getCityId={this.getCityId} getAttrType={this.getAttrType} getIsRainingCond={this.getIsRainingCond} getMinAge={this.getMinAge} selectionList={this.state.selectionList} getShowAllAttr={this.setShowAllAttr} />
                    <DisplayResults list={this.state}/>
                    <Footer />
                </div>
    }
    getCityId = (param) =>{
        this.AttractionsPerCityId(param);
    }
    getAttrType = (type) =>{
        this.type = type;
        this.setState({type: this.type});
        this.setSelectionList(this.type);
    }
    AttractionsPerCityId(id){
        fetch('http://localhost:3000/city/'+ id)
            .then(resp => resp.json())
            .then(data => {
                this.setState({attrPerCity: data, cityLat: Number(data.lat), cityLng: Number(data.lng)}), this.state.type !== null && this.setSelectionList(this.state.type);
            });
    }
    setSelectionList(type){
        type === 'attractions' && this.setState({selectionList: this.state.attrPerCity.attractions});
        type === 'playgrounds' && this.setState({selectionList: this.state.attrPerCity.playgrounds});
        type === 'baby_changing_st' && this.setState({selectionList: this.state.attrPerCity.baby_changing_st});
    }
    getIsRainingCond = (condition) =>{
        this.setState({isRaining: condition});
    }
    getMinAge = (age) =>{
        console.log('setMinAge: ', age);
        this.setState({min_age: age});
    }
    setShowAllAttr =(param)=>{
        console.log('showAllAttr: ', param);
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
        return <div className="container" >
                    <div className="search">
                        <img id="img_logo" src="src/img/monkey_logo_text.png" alt="logo" />
                    </div>

                    <CitySearch attractions={this.state.attractions} getCityId={this.getCityId} />

                    <AttractionsSearch getAttrType={this.getAttrType} style={this.state.isCitySelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

                    <ByAgeSearch getMinAge={this.getMinAge} getShowAllAttr={this.getShowAllAttr} selectionList={this.props.selectionList} style={this.state.isAttrSelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

                    {/*<div className="search">*/}
                        {/*<p> "Najwieksza baza atrakcji i okolicznych placow zabaw. Z nami nie bedziesz sie nudzic nawet gdy padadeszcz!" </p>*/}
                    {/*</div>*/}

                    <IsRainingOption getIsRainingCond={this.getIsRainingCond} style={this.state.isCitySelected? {visibility: 'visible'} : {visibility: 'hidden'}} />

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
}

class CitySearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            city: null,
            id: null
        }
    }
    render(){
        if(!this.props.attractions)
            return null;

        let cityList = this.props.attractions.map(c => <li key={c.id} value={c.name} onClick={() => this.setCityId(c.name, c.id)}>{c.name}</li>);

        return <div className="search"><span>Wybierz miasto:</span>
                    <div>{this.state.city == null? 'Wybierz miasto' : this.state.city}</div>
                    <ul>
                        {cityList}
                    </ul>
                </div>
    }
    setCityId = (city, id) =>{
        this.setState({city: city, id: id});
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
        return <nav className="search" style={this.props.style}>Czego szukasz?
                    <div>{this.state.selection == null? 'Wybierz z listy' : this.state.selection}</div>
                    <ul>
                        {this.state.inputs.map((el, i) =><li key={i} value={el.value} onClick={() => this.setAttrType(el.value, el.text)}>{el.text}</li>)}
                    </ul>
                </nav>
    }
    setAttrType = (val, selection) =>{
        this.setState({selection: selection});
        typeof(this.props.getAttrType) === 'function' && this.props.getAttrType(val);
    }
}

class ByAgeSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: 0,
            isChecked: true,
            // isAgeChecked: false
        }
    }
    render(){
        return  <div className="search" style={this.props.style}>
                    <input type="checkbox" value={!this.state.isChecked} onChange={this.handleCheckbox} checked={!this.state.isChecked? true : false} style={{width: '25px', height: '25px'}} /><p> Okresl minimalny wiek pociechy: </p>
                    <div style={this.state.isChecked? {visibility: 'hidden'} : {visibility: 'visible'}}>
                        <span>Od: </span><input type="range" min="0" max="14" value={this.state.value} onChange={(e) => this.handleSlide(e.target.value)} />
                        <p>od {this.state.value} lat</p>
                    </div>
                    <input type="checkbox" value={this.state.isChecked} onChange={this.handleCheckbox} checked={this.state.isChecked? true : false} style={{width: '25px', height: '25px'}} /><p>Wszystkie atrakcje</p>
                </div>
    }
    handleSlide = (e) =>{
        this.setState({value: e}, () => this.setState({isChecked: false}));
        typeof(this.props.getMinAge) === 'function' && this.props.getMinAge(e);
    }
    handleCheckbox = (e) =>{
        this.setState({isChecked: !this.state.isChecked}, () => typeof(this.props.getShowAllAttr) === 'function' && this.props.getShowAllAttr(this.state.isChecked));
        typeof(this.props.getMinAge) === 'function' && this.props.getMinAge(0);
    }
}

class IsRainingOption extends React.Component{
    render(){
        return <div className="search" style={this.props.style}>
            {/*<button id="search_btn">Szukaj*/}
            <input type='checkbox' style={{width: '25px', height: '25px'}} onChange={(e) => this.isRaining(e.target.checked)}></input>
            {/*<img src="src/img/banana.png" alt="banana" />*/}
            <p>Pada deszcz? </p>
            <img className="monkey_pic" src="src/img/circus-monkey.png" alt="little_monkey_icon" />
        </div>
    }
    isRaining =(e)=>{
        typeof(this.props.getIsRainingCond) === 'function' && this.props.getIsRainingCond(e);
    }
}

class DisplayResults extends React.Component{
    render(){

        const listToDisplay = [];

        if(this.props.list.type === 'baby_changing_st'){
            listToDisplay.push(...this.props.list.selectionList);
        }else{
            this.props.list.selectionList != null && this.props.list.selectionList.forEach((select) => {
                if(select.age_from <= this.props.list.min_age){
                    this.props.list.isRaining?
                        this.props.list.isRaining === select.indoor && listToDisplay.push(select) :
                        listToDisplay.push(select);
                }else if(this.props.list.showAllAttr == true){
                    this.props.list.isRaining?
                        this.props.list.isRaining === select.indoor && listToDisplay.push(select) :
                        listToDisplay.push(select);
                }
            })
        }

        return <div>
            {!this.props.list.selectionList? null : <ListDisplay list={listToDisplay}/>}
            {!this.props.list.selectionList? null : <MapDisplay list={listToDisplay} city={this.props.list} />}
        </div>
    }
}

class ListDisplay extends React.Component{
    render(){

        return <div className="container" style={{background: 'white'}}>

                    {!this.props.list? null : this.props.list.map((el, i) => <div key={i} style={{fontFamily: "Arial, Helvetica, sans-serif"}}>
                        <img src={el.pictures} alt="pic" height='250px' width='250px' style={{borderRadius: '10px'}}></img>
                        <h4>{el.name}</h4>
                        <p style={{fontSize: '1.75rem'}}>{el.address}</p>
                        <p style={{fontSize: '1.75rem'}}>{el.description}</p>
                    </div>)}
        </div>
    }
}

class MapDisplay extends React.PureComponent {
    state = {
        isMarkerShown: false,
        markers: this.props.list.map((el) => ({lat: el.lat, lng: el.lng, id: el.id})),
        cityLat: this.props.city.cityLat,
        cityLng: this.props.city.cityLng
    }

    componentDidMount() {
        this.delayedShowMarker()
    }

    componentWillReceiveProps(nextProps) {
        if(this.props != nextProps) {
            this.setState({
                markers: nextProps.list.map(el => ({lat: el.lat, lng: el.lng, id: el.id})),
                cityLat: nextProps.city.cityLat,
                cityLng: nextProps.city.cityLng
            });
        }
    }

    delayedShowMarker = (id) => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 1500)
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        return (
            <MapComponent
                isMarkerShown={this.state.isMarkerShown}
                coordinates={this.state}
                onMarkerClick={this.handleMarkerClick}
            />
        )
    }
}


const MapComponent = compose(
    withProps({
        // googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2sDQZ-36NLlY4iMvoiuQ7mS1n-v8iq2M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px`, width: '100rem'}} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={14}
        center={{ lat: props.coordinates.cityLat, lng: props.coordinates.cityLng }}>
        {props.coordinates.isMarkerShown && props.coordinates.markers.map(m => <Marker key={m.id} position={{ lat: Number(m.lat), lng: Number(m.lng) }} onClick={() => props.onMarkerClick(m.id)} />)}
    </GoogleMap>
)


class Footer extends React.Component{
    render(){
        return <footer>
                    <div className="container">
                        <nav>
                            <a href="#start" className="active">Start</a>
                            <a href="#map">Mapa Atrakcji</a>
                            <a href="#contact">Kontakt</a>
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


document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});