import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

class LoginPage extends Component{
	constructor(props){
		super(props)
		this.MakeLogin = this.MakeLogin.bind(this)
		this.FormChange = this.FormChange.bind(this)
		this.state={
			username: '',
			password: '',
			errors: false,
			loading: false
		}
	}
	MakeLogin(event){
		event.preventDefault()
		if (!this.state.loading){
			this.setState({loading: true})
			const endpoint = '/api/login'
			let formdata = new FormData()
			formdata.append('username',this.state.username)
			formdata.append('password',this.state.password)
			let options = {
				method: 'POST',
				body: formdata,
			}
			fetch(endpoint,options)
			.then(respone => {
				if(respone.ok){
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
			errors: false,
			loading: false
		})
	}
	render(){
		return(
			this.props.isAuth ? (<Redirect to='/site/main'/>):(
				<div className='container-fluid' id='LoginFormCol'>
					<div className='row'>
						<div className='col-md-6 col-sm-12 text-center mx-auto rounded FormShadow'>
							<h1 className='mb-4'>Вход</h1>
							<form onSubmit={this.MakeLogin}>
								<div className='form-group mb-3'>
									<label htmlFor='UsernameLoginInput'>Логин</label>
									<input className={`form-control ${this.state.errors ? 'is-invalid':''}`} onChange={this.FormChange} value={this.state.username} placeholder='Username*' id='UsernameLoginInput' name='username' type='username'></input>
									<div className="invalid-feedback">Неверный Логин</div>
								</div>
								<div className='form-group mb-3'>
									<label htmlFor='UsernameLoginInput'>Пароль</label>
									<input className={`form-control ${this.state.errors ? 'is-invalid':''}`} onChange={this.FormChange} value={this.state.password} placeholder='Password*' id='UsernamePasswordInput' name='password' type='password'></input>
									<div className="invalid-feedback">Неверный Пароль</div>
								</div>
								<button type="submit" className={`btn btn-primary btn-lg mx-auto ${this.state.loading ? 'disabled':''}`}>Вход</button>
							</form>
						</div>
					</div>
				</div>
			)
		);
	}
}

export default LoginPage;