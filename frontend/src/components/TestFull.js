import React, {Component} from 'react'
import QuestionCard from './QuestionCard'

class TestFull extends Component{
	constructor(props){
		super(props)
		this.GetSingleTest = this.GetSingleTest.bind(this)
		this.InputChange = this.InputChange.bind(this)
		this.SendAnswersHand = this.SendAnswersHand.bind(this)
		this.SetCheck = this.SetCheck.bind(this)
		this.StartTest = this.StartTest.bind(this)
		this.SetTimer = this.SetTimer.bind(this)
		this.state = {
			questions: [],
			test_info: {},
			in_progress: false,
			check: {},
			timer_time: 372060,
		}
	}
	InputChange(event){
		let test_data = JSON.parse(localStorage.getItem(`test_${this.state.test_info.id}_answers`))
		let question_name = event.target.name.split('_')
		if(event.target.checked){
			if(test_data.main_data.hasOwnProperty(`q_${question_name[1]}`)){
				test_data.main_data[`q_${question_name[1]}`].push(question_name[2])
			}
			else{
				test_data.main_data[`q_${question_name[1]}`] = []
				test_data.main_data[`q_${question_name[1]}`].push(question_name[2])
			}
		}
		else{
			test_data.main_data[`q_${question_name[1]}`].splice(test_data.main_data[`q_${question_name[1]}`].indexOf(`${question_name[2]}`),1)
		}
		localStorage.setItem(`test_${this.state.test_info.id}_answers`,JSON.stringify(test_data))
		this.SetCheck()
	}
	SendAnswersHand(event){
		event.preventDefault()
		const endpoint = `/api/test_result`
			let options = {
					method: 'POST',
					headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
					},
					body: localStorage.getItem(`test_${this.state.test_info.id}_answers`)
				}
		fetch(endpoint, options)
		.then(response =>{
			if(response.ok){
				clearTimeout(parseInt(localStorage.getItem(`timeout_${this.state.test_info.id}`)))
				localStorage.removeItem(`timeout_${this.state.test_info.id}`)
				localStorage.removeItem(`test_${this.state.test_info.id}_answers`)
				clearInterval(parseInt(localStorage.getItem(`timer_time_id_${this.state.test_info.id}`)))
				localStorage.removeItem(`timer_time_id_${this.state.test_info.id}`)
				this.props.GetTimers()
				this.setState({in_progress: false},()=>{
						let info = this.state.test_info
						info.completed = true
						this.setState({test_info: info})
					})
			}
		})
		.catch(error => console.log('ERROR',error))
	}
	GetSingleTest(){
		const endpoint = `/api/tests/${this.props.match.params.slug}`
			let options = {
					method: 'GET',
					headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
					}
				}	
			fetch(endpoint,options)
			.then(response => response.json())
			.then(responeData => {
				this.setState({questions: responeData[1]})
				this.setState({test_info: responeData[0]},()=>{
					this.setState({in_progress:this.state.test_info.in_progress},()=>{
						this.SetTimer()
						this.SetCheck()
					})
				})
			})
			.catch(error => console.log('ERROR',error))
	}
	SetCheck(){
		if(this.state.in_progress){
			let data = JSON.parse(localStorage.getItem(`test_${this.state.test_info.id}_answers`)).main_data
			this.setState({check:data})
		}
	}
	SetTimer(){
		if(this.state.in_progress){
			if(localStorage.getItem(`timer_time_id_${this.state.test_info.id}`)!=undefined){
				clearInterval(localStorage.getItem(`timer_time_id_${this.state.test_info.id}`))
				localStorage.removeItem(`timer_time_id_${this.state.test_info.id}`)
			}
			let data = JSON.parse(localStorage.timers)
			let obj = data.find((ob)=>ob.test==this.state.test_info.id)
			let mil = (parseInt(obj.start_time)+parseInt(obj.duration)*60 - Math.floor(Date.now()/1000))
			this.setState({timer_time: mil},()=>{
				let interval = setInterval(()=>{
				let time = this.state.timer_time
				if(time-1 >= 0){
					this.setState({timer_time:time-1})
				}
				else{
					this.setState({in_progress: false},()=>{
						let info = this.state.test_info
						info.completed = true
						this.setState({test_info: info},()=>{console.log(this.state.test_info)})
					})
					clearInterval(parseInt(localStorage.getItem(`timer_time_id_${this.state.test_info.id}`)))
					localStorage.removeItem(`timer_time_id_${this.state.test_info.id}`)
				}
				},1000)
				localStorage.setItem(`timer_time_id_${this.state.test_info.id}`,interval)
			})
		}
	}
	StartTest(event){
		event.preventDefault()
		if(!event.target.classList.contains('disabled')){
			const endpoint = `/api/timer/create`
			let options = {
					method: 'POST',
					headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
					},
					body: JSON.stringify({'duration': parseInt(this.state.test_info.duration),'test': this.state.test_info.id})
				}
			fetch(endpoint, options)
			.then(response =>{
				if(response.ok){
					this.setState({in_progress: true},()=>{
						this.props.GetTimers(this.SetTimer)
					})
				}
			})
			.catch(error => console.log('ERROR',error))	
		}
	}
	componentDidMount(){
		this.GetSingleTest()
	}
	render(){
		return(
			<div className='container mt-4 TestSingle bg-light'>
				{this.state.in_progress ?
				 <div className='row'>
				 	<div className='col-sm-12 col-md-8 mb-3'>
						<h3 className='TestTitle'>{this.state.test_info.test_name}</h3>
					</div>
					<div className='col-sm-12 col-md-4'>
						<h3>{Math.floor(this.state.timer_time/3600)}:{Math.floor((this.state.timer_time%3600)/60)}:{this.state.timer_time%60}</h3>
					</div>
					{Object.keys(this.state.test_info).length !== 0 ? this.state.questions.map((ob,idx)=><QuestionCard check={this.state.check.hasOwnProperty(`q_${ob.id}`) ? this.state.check[`q_${ob.id}`] : []} key={idx} data={ob} InputChange={this.InputChange}/>) : ''}
				 	<div className='col-sm-12'>
				 		<button onClick={this.SendAnswersHand} type="button" className="btn btn-outline-primary btn-lg btn-block">Завершить тест</button>
				 	</div>
				 </div>
				: 
				<div className='row'>
					<div className='col-sm-12 col-md-8 mb-3'>
						<h3 className='TestTitle'>{this.state.test_info.test_name}</h3>
					</div>
					<div className='col-sm-12 col-md-4 TestDuration mb-3'>
						<span><i className="far fa-clock"></i> Длительность: {`${Math.floor(this.state.test_info.duration/60)} ч. ${this.state.test_info.duration%60} мин.`}</span>
						<div className='TestResult TestResultSingle'>
							<div className={`TestStatus ${this.state.test_info.completed ? 'bg-success' : 'bg-danger'}`}></div>
							<h5 className='card-title ml-3'>{this.state.test_info.completed && this.state.test_info.result!=null ? `${this.state.test_info.result}`:'0'}<span>%</span></h5>
						</div>
					</div>
					<div className='col-sm-12 mb-3'>
						<span className='TestDescription'>{this.state.test_info.test_description}</span>
					</div>
					<div className='col-sm-12'>
						<button onClick={this.StartTest} type="button" className={`btn btn-outline-secondary btn-lg ${this.state.test_info.active && !this.state.test_info.completed ? '': 'disabled'}`}>Начать тест</button>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default TestFull;