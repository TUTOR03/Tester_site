import React,{Component} from 'react'
import {Route, BrowserRouter, Switch} from 'react-router-dom'
import MainPage from './MainPage'
import LoginPage from './Login'
import RegisterPage from './Register'

class App extends Component{
	constructor(props){
		super(props)
		this.UpdateToken = this.UpdateToken.bind(this)
		this.state={
			isAuth: false
		}
	}
	UpdateToken(){
		this.setState({isAuth: localStorage.token ? true:false})
	}
	componentDidMount(){
		this.UpdateToken()
	}
	render(){
		return(
			<BrowserRouter>
				<Switch>
					<Route path='/site/main' render={ ()=><MainPage isAuth={this.state.isAuth} UpdateToken={this.UpdateToken}/>}/>
					<Route exact path='/site/login' render={ ()=><LoginPage isAuth={this.state.isAuth} UpdateToken={this.UpdateToken}/>}/>
					<Route exact path='/site/register' render={()=><RegisterPage isAuth={this.state.isAuth} UpdateToken={this.UpdateToken}/>}/>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;