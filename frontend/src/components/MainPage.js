import React,{Component} from 'react'
import {Route, BrowserRouter, Switch} from 'react-router-dom'
import Navbar from './Navbar'
import TestList from './TestList'
import TestFull from './TestFull'

class MainPage extends Component{
	constructor(props){
		super(props)
		this.GetTimers = this.GetTimers.bind(this)
		this.CreateAnswerStorage = this.CreateAnswerStorage.bind(this)
		this.SetTimers = this.SetTimers.bind(this)
		this.SendAnswers = this.SendAnswers.bind(this)
		}
	GetTimers(callb){
		if(localStorage.token){
			if(localStorage.timers){
				JSON.parse(localStorage.timers).forEach((ob)=>{
					if(localStorage.getItem(`timeout_${ob.test}`)){
						clearTimeout(parseInt(localStorage.getItem(`timeout_${ob.test}`)))
						localStorage.removeItem(`timeout_${ob.test}`)
					}
				})
			}
			const endpoint = `/api/timer`
			let options = {
					method: 'GET',
					headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
					}
				}
			fetch(endpoint,options)
			.then(response =>{
				if(response.ok){
					response.json()
					.then(responeData =>{
						localStorage.setItem('timers',JSON.stringify(responeData))
						this.CreateAnswerStorage()
						this.SetTimers()
						if(callb !== undefined){
							callb()
						}
					})
				}
			})
		}
	}
	SetTimers(){
		JSON.parse(localStorage.timers).forEach((ob)=>{
			let mil = (parseInt(ob.start_time)+parseInt(ob.duration)*60 - Math.floor(Date.now()/1000))*1000
			let timer = setTimeout(()=>{this.SendAnswers(ob.test)}, mil >=0 ? mil : 0)
			// let timer = setTimeout(()=>{this.SendAnswers(ob.test)},20000)
			localStorage.setItem(`timeout_${ob.test}`,`${timer}`)
		})

	}
	SendAnswers(test_id){
		const endpoint = `/api/test_result`
			let options = {
					method: 'POST',
					headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
					},
					body: localStorage.getItem(`test_${test_id}_answers`)
				}
		fetch(endpoint, options)
		.then(response =>{
			if(response.ok){
				localStorage.removeItem(`timeout_${test_id}`)
				localStorage.removeItem(`test_${test_id}_answers`)
			}
		})
		.catch(error => console.log('ERROR',error))
	}
	CreateAnswerStorage(){
		JSON.parse(localStorage.timers).forEach((ob)=>{
			if(!localStorage.getItem(`test_${ob.test}_answers`)){
				let data = {
					user:{
						user_id: localStorage.user_id,
						test_id : ob.test,
						timer_id : ob.id
					},
					main_data:{}
				}
				localStorage.setItem(`test_${ob.test}_answers`,JSON.stringify(data))
			}
		})
	}
	componentDidMount(){
		this.GetTimers()
	}
	render(){
		return(
				<div>
					<header>
						<Navbar isAuth={this.props.isAuth} UpdateToken={this.props.UpdateToken}/>
					</header>
					<main>
						{this.props.isAuth ? 
							<Switch>
								<Route exact path='/site/main' render={()=><TestList isAuth={this.props.isAuth} UpdateToken={this.props.UpdateToken}/>}/>
								<Route exact path='/site/main/:slug' render={ ({match})=><TestFull GetTimers={this.GetTimers} match={match}/> }/>
							</Switch>	
							:
							<h1>Необходимо авторизироваться или зарегистрировать аккаунт</h1>	 
						}
					</main>
				</div>
		);
	}
}

export default MainPage;