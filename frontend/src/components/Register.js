import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

class RegisterPage extends Component{
	constructor(props){
		super(props)
		this.FormChange = this.FormChange.bind(this)
		this.MakeRegister = this.MakeRegister.bind(this)
		this.state={
			username: '',
			password: '',
			first_name: '',
			last_name: '',
			email: '',
			errors: false,
			loading: false
		}
	}
	MakeRegister(event){
		event.preventDefault()
		if (!this.state.loading){
			this.setState({loading: true})
			const endpoint = '/api/register'
			let formdata = new FormData()
			formdata.append('username',this.state.username)
			formdata.append('password',this.state.password)
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
						localStorage.setItem('token',responeData.token)
						localStorage.setItem('user_id',responeData.user_id)
						localStorage.setItem('first_name',responeData.first_name)
						localStorage.setItem('last_name',responeData.last_name)
						localStorage.setItem('is_admin',responeData.is_admin)
						this.props.UpdateToken()
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
			loading: false
		})
	}
	render(){
		return(
			this.props.isAuth ? (<Redirect to='/site/main'/>):(
				<div className='container-fluid' id='RegisterFormCol'>
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
									<div className="form-group col-md-6 col-sm-12">
      									<label htmlFor="UsernameRegisterInput">Логин</label>
      									<input type='username' name='username' onChange={this.FormChange} value={this.state.username} className={`form-control ${this.state.errors ? 'is-invalid':''}`} id="UsernameRegisterInput" placeholder="Логин*"/>
    									<div className="invalid-feedback">Неверный Логин или Логин отсутствует</div>
    								</div>
									<div className="form-group col-md-6 col-sm-12">
      									<label htmlFor="PasswordRegisterInput">Пароль</label>
      									<input type='password' name='password' onChange={this.FormChange} value={this.state.password} className={`form-control ${this.state.errors ? 'is-invalid':''}`} id="PasswordRegisterInput" placeholder="Пароль*"/>
    									<div className="invalid-feedback">Неверный Пароль или Пароль отсутствует</div>
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
				</div>
			)
		);
	}
}

export default RegisterPage;