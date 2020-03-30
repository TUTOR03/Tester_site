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
		this.UpdateProgress = this.UpdateProgress.bind(this)

		this.state = {
			questions: [],
			test_info: {},
			in_progress: false,
			check: {}
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
				this.props.GetTimers(this.UpdateProgress)
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
					this.UpdateProgress(this.SetCheck)
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
	StartTest(event){
		event.preventDefault()
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
				this.props.GetTimers(this.UpdateProgress)
			}
		})
		.catch(error => console.log('ERROR',error))	
	}
	UpdateProgress(callb){
		this.setState({in_progress: JSON.parse(localStorage.getItem('timers')).filter((ob)=>ob.test == this.state.test_info.id).length > 0 ? true : false},()=>{if(callb!==undefined){callb()}})
	}
	componentDidMount(){
		this.GetSingleTest()
	}
	render(){
		return(
			<div className='container mt-4 TestSingle bg-light'>
				{this.state.in_progress && this.state.test_info.active && !this.state.test_info.completed ?
				 <div className='row'>
				 	<div className='col-sm-12 col-md-8 mb-3'>
						<h3 className='TestTitle'>{this.state.test_info.test_name}</h3>
					</div>
					<div className='col-sm-12 col-md-4'>
						<h3>TIMER</h3>
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