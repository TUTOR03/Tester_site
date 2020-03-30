import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class TestSingle extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const {test_name} = this.props.data
		const {test_description} = this.props.data
		const {slug} = this.props.data
		const {result} = this.props.data
		const {completed} = this.props.data
		const {active} = this.props.data
		return(
			<div className='col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3'>
				<div className='card TestCard'>
					<Link to={`/site/main/${slug}`}>
						<div className='card-header'>
							<div className={`TestActive mr-2 mt-2 ${active ? 'bg-info' : ''}`}></div>
							{test_name.length>20 ? `${test_name.slice(0,20)}...`: test_name}
						</div>
					</Link>
					<div className='card-body'>
						<div className='TestResult mb-3'>
							<div className={`TestStatus ${completed ? 'bg-success' : 'bg-danger'}`}></div>
							<h5 className='card-title ml-3'>{completed ? `${result}`:'0'}<span>%</span></h5>
						</div>
						<p className='card-text'>{test_description.length>50 ? `${test_description.slice(0,101)}...`: test_description }</p>
					</div>
				</div>
			</div>
		);
	}
}

export default TestSingle;