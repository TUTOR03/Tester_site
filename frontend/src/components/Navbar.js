import React,{Component} from 'react'
import {Link} from 'react-router-dom'
class Navbar extends Component{
	constructor(props){
		super(props)
		this.LogOut = this.LogOut.bind(this)
	}

	LogOut(event){
		event.preventDefault()
		const endpoint = '/api/logout'
		let options = {
				method: 'POST',
				headers: {
					'Authorization': `Token ${localStorage.token}`
				}
			}
		fetch(endpoint,options)
		.then(respone =>{
			if(respone.ok){
				localStorage.removeItem('token')
				localStorage.removeItem('username')
				localStorage.removeItem('first_name')
				localStorage.removeItem('last_name')
				this.props.UpdateToken()
			}
		})
		.catch(error =>console.log('ERROR',error))

	}
	render(){
		return(
				<nav className='navbar navbar-expand-md navbar-light bg-light py-2'>
					<a className='navbar-brand'>NAVBAR</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
    					<span className="navbar-toggler-icon"></span>
  					</button>
  					<div className='collapse navbar-collapse' id='navbarToggler'>
  						<ul className='navbar-nav'>
  							<li className="nav-item">
  								<Link to='/site/main' className='nav-link'>Тесты</Link>
      						</li>
      						<li className='nav-item AccountItem dropdown'>
      							{this.props.isAuth ?
      							<div className='Account'>
      								<button className='AccountInfo btn btn-light dropdown-toggle' type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
  										<div className='AccountImg'></div>
  										<span className='AccountName ml-2'>{`${localStorage.last_name} ${localStorage.first_name}`}</span>
  									</button>
  									<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
  										<Link className='dropdown-item' to='/site/main/settings'><i className="fas fa-cogs mr-2"></i>Настройки</Link>
								    	<div className="dropdown-divider"></div>
								    	<a onClick={this.LogOut} className="dropdown-item" href=""><i className="fas fa-sign-out-alt mr-2"></i>Выход</a>
  									</div>
      							</div>
  								:
  								<div className='AccountBtns'>
  									<Link to='/site/login'><button type="button" className="btn btn-outline-primary mr-3">Вход</button></Link>
  									<Link to='/site/register'><button type="button" className="btn btn-outline-primary mr-3">Регистрация</button></Link>
  								</div>
  								}
      						</li>
  						</ul>
  					</div>
				</nav>
		);
	}
}

export default Navbar;