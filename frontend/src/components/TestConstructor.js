import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import TestConstructorQuestion from './TestConstructorQuestion'

class TestConstructor extends Component{
	constructor(props){
		super(props)
		this.SimpleInputChange = this.SimpleInputChange.bind(this)
		this.AddQuestion = this.AddQuestion.bind(this)
		this.AddAnswer = this.AddAnswer.bind(this)
		this.InputChange = this.InputChange.bind(this)
		this.InputCheckChange = this.InputCheckChange.bind(this)
		this.DelPositions = this.DelPositions.bind(this)
		this.CreateTest = this.CreateTest.bind(this)
		this.state = {
			test_title:'',
			test_description:'',
			questions: []
		}
	}
	AddQuestion(event){
		event.preventDefault()
		let q_data = this.state.questions
		q_data.push({
			q_text: '',
			q_answers: []
		})
		this.setState({questions: q_data})
	}
	AddAnswer(event){
		event.preventDefault()
		let q_data = this.state.questions
		let data_type = parseInt(event.target.name.split('_')[2]) 
		q_data[data_type].q_answers.push({
			a_text:'',
			a_right: false,
		})
		this.setState({questions: q_data})
	}
	DelPositions(event){
		event.preventDefault()
		let data_type = event.target.name
		if(data_type == undefined){
			data_type = event.target.parentElement.name
		}
		data_type = data_type.split('_')
		let q_data = this.state.questions
		if(data_type.length == 2){
			q_data.splice(parseInt(data_type[1]),1)
		}
		else if(data_type.length == 3){
			q_data[parseInt(data_type[1])].q_answers.splice(parseInt(data_type[2]),1)
		}
		this.setState({questions: q_data},()=>console.log(this.state.questions))
	}
	SimpleInputChange(event){
		event.preventDefault()
		this.setState({[event.target.name]:event.target.value})
	}
	InputChange(event){
		event.preventDefault()
		let data_type = event.target.name.split('_')
		if(data_type.length == 2){
			let q_data = this.state.questions
			q_data[parseInt(data_type[1])].q_text = event.target.value
			this.setState({questions: q_data})
		}
		else if(data_type.length == 3){
			let q_data = this.state.questions
			q_data[parseInt(data_type[1])].q_answers[parseInt(data_type[2])].a_text = event.target.value
			this.setState({questions: q_data})
		}
	}
	InputCheckChange(event){
		let data_type = event.target.name.split('_')
		let q_data = this.state.questions
		q_data[parseInt(data_type[1])].q_answers[parseInt(data_type[2])].a_right = !q_data[parseInt(data_type[1])].q_answers[parseInt(data_type[2])].a_right
		this.setState({questions:q_data})
	}
	// GetTestToEdit(){
	// 	const endpoint = '/api/test/create/'
	// 		let options = {
	// 			method: 'GET',
	// 			headers: {
	// 					'Content-type':'application/json',
	// 					'Authorization': `Token ${localStorage.token}`
	// 			},
	// 			body: JSON.stringify({test_id: this.props.match.params})
	// 		}
	// 		fetch(endpoint, options)
	// 		.then(respone => respone.json())
	// 		.then(responeData =>{
	// 			this.setState
	// 		})
	// }
	CreateTest(event){
		event.preventDefault()
		const endpoint = '/api/test/create'
			let options = {
				method: 'POST',
				headers: {
						'Content-type':'application/json',
						'Authorization': `Token ${localStorage.token}`
				},
				body: JSON.stringify(this.state)
			}
		fetch(endpoint, options)
		.then(respone =>{
			if(respone.ok){
				console.log(`NEW TEST OK`)
			}
		})
	}
	// componentDidMount(){
	// 	if(this.props.match.params.id && localStorage.is_admin == 'true'){
	// 		this.setState({test_id: this.props.match.params.id})

	// 	}
	// }
	render(){
		return(
			 localStorage.is_admin == 'true' && this.props.isAuth ? 
			<div className='container mt-4 TestConst bg-light'>
				<div className='row'>
					<div className='col-sm-12'>
						<div className='form-group mb-3'>
							<input onChange={this.SimpleInputChange} value={this.state.test_title} className='form-control' placeholder='НАЗВАНИЕ ТЕСТА' id='TestTitleInput' name='test_title'></input>
						</div>
					</div>
					<div className='col-sm-12'>
						<div className='form-group mb-3'>
							<textarea onChange={this.SimpleInputChange} value={this.state.test_description} className="form-control" placeholder='ОПИСАНИЕ ТЕСТА' id='TestDescriptionInput' name='test_description'></textarea>
						</div>
					</div>
					{this.state.questions.map((ob,idx)=><TestConstructorQuestion key={idx} iter={idx} data={ob} DelPositions={this.DelPositions} InputCheckChange={this.InputCheckChange} InputChange={this.InputChange} AddAnswer={this.AddAnswer}/>)}
					<div className='col-sm-12 mb-3'>
						<button onClick={this.AddQuestion} type="button" className='btn btn-outline-primary btn-lg btn-block'>Добавить вопрос</button>
					</div>
					<div className='col-sm-12'>
						<button onClick={this.CreateTest} type="button" className='btn btn-outline-success btn-lg btn-block'>Сохранить тест</button>
					</div>
				</div>
			</div>
			:
			<Redirect to='/site/main'/>
		);
	}
}

export default TestConstructor;