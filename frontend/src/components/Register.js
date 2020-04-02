import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

class RegisterPage extends Component{
	constructor(props){
		super(props)
		this.FormChange = this.FormChange.bind(this)
		this.MakeRegister = this.MakeRegister.bind(this)
		this.FinishRegister = this.FinishRegister.bind(this)
		this.state={
			username: '',
			password: '',
			first_name: '',
			last_name: '',
			email: '',
			errors: false,
			loading: false,
			got_data: false,
			finished: false
		}
	}
	MakeRegister(event){
		event.preventDefault()
		if (!this.state.loading){
			this.setState({loading: true})
			const endpoint = '/api/register'
			let formdata = new FormData()
			formdata.append('first_name',this.state.first_name)
			formdata.append('last_name',this.state.last_name)
			formdata.append('email',this.state.email)
			let options = {
				method: 'POST',
				body: formdata,
			}
			fetch(endpoint,options)
			.then(respone => {
				if(respone.ok && this.state.first_name!='' && this.state.last_name!='' && this.state.email!=''){
					respone.json()
					.then(responeData => {
						this.setState({
							username: responeData.username,
							password: responeData.password,
							got_data: true,
						})
					})
					.catch(error => console.log('ERROR',error))
				}
				else{
					this.setState({errors: true})
					this.setState({loading: false})
				}
			})
		}
	}
	FinishRegister(event){
		event.preventDefault()
		this.setState({finished: true})
	}
	FormChange(event){
		event.preventDefault()
		this.setState({[event.target.name]:event.target.value})
		if(this.state.errors == true){
			this.setState({errors:false})
		}
	}
	componentDidMount(){
		this.setState({
			username: '',
			password: '',
			first_name: '',
			last_name: '',
			email: '',
			errors: false,
			loading: false,
			got_data: false,
			finished: false
		})
	}
	render(){
		return(
			this.props.isAuth || this.state.finished ? (<Redirect to='/site/main'/>):(
				<div className='container-fluid' id='RegisterFormCol'>
					{this.state.got_data?
					<div className='row RegisterFinish FormShadow'>
						<div className='col-sm-10 mb-3'>
							<h3>Логин: {this.state.username}</h3>
						</div>
						<div className='col-sm-10 mb-3'>
							<h3>Пароль: {this.state.password}</h3>
						</div>
						<div className='col-sm-10'>
							<button onClick={this.FinishRegister} className='btn btn-outline-success btn-lg btn-block' type='button'>Заершить регистрацию</button>
						</div>
					</div>
					 :
					 <div className='row'>
						<div className='col-md-7 col-sm-12 text-center mx-auto rounded FormShadow'>
							<h1 className='mb-4'>Регистрация</h1>
							<form onSubmit={this.MakeRegister}>
								<div className='form-row'>
									<div className="form-group col-md-6 col-sm-12">
      									<label htmlFor="FirsNameRegisterInput">Имя</label>
      									<input name='first_name' onChange={this.FormChange} value={this.state.first_name} className={`form-control ${this.state.errors ? 'is-invalid':''}`} id="FirsNameRegisterInput" placeholder="Имя*"/>
    									<div className="invalid-feedback">Отсутствует Имя</div>
    								</div>
    								<div className="form-group col-md-6 col-sm-12">
      									<label htmlFor="LastNameRegisterInput">Фамилия</label>
      									<input name='last_name' onChange={this.FormChange} value={this.state.last_name} className={`form-control ${this.state.errors ? 'is-invalid':''}`} id="LastNameRegisterInput" placeholder="Фамилия*"/>
    									<div className="invalid-feedback">Отсутствует Фамилия</div>
    								</div>
								</div>
								<div className='form-row'>
									<div className="form-group col-md-10 col-sm-12 mx-auto">
      									<label htmlFor="EmailRegisterInput">Почта</label>
      									<input type='email' name='email' onChange={this.FormChange} value={this.state.email} className={`form-control ${this.state.errors ? 'is-invalid':''}`} id="EmailRegisterInput" placeholder="Почта*"/>
    									<div className="invalid-feedback">Неверная Почта или Почта отсутствует</div>
    								</div>
								</div>
								<button type="submit" className={`btn btn-primary btn-lg mx-auto ${this.state.loading ? 'disabled':''}`}>Зарегистрироваться</button>
							</form>
						</div>
					</div>
					}
				</div>
			)
		);
	}
}

export default RegisterPage;