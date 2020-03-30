import React, {Component} from 'react'
import TestSingle from './TestSingle'

class TestList extends Component{
	constructor(props){
		super(props)
		this.GetTests = this.GetTests.bind(this)
		this.state = {
			tests_list: []
		}
	}
	GetTests(){
		if(this.props.isAuth){
			const endpoint = '/api/tests'
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
				this.setState({tests_list: responeData})
			})
			.catch(error => console.log('ERROR',error))
		}
	}
	componentDidMount(){
		this.GetTests()
	}
	render(){
		return(
			<div className='container-fluid main mt-4'>
				<div className='row'>
					{this.state.tests_list.map((ob,idx)=><TestSingle key={idx} data={ob}/>)}
				</div> 
			</div>
		);
	}
}

export default TestList;