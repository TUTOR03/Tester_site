import React, {Component} from 'react'

class QuestionCard extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const {data} = this.props
		return(
			<div className='col-sm-12 SingleAnswer'>
				<div className='card mb-3'>
					<div className='card-header'>
						{data.question_text}
					</div>
					<ul className="list-group list-group-flush">
						{data.answers.map((ob,idx)=>{
							return(
								<li key={idx} className="list-group-item">
									{ob[0]}
									<div className='custom-control custom-control-inline custom-checkbox'>
										<input checked={this.props.check.indexOf(`${ob[1]}`)!=-1 ? true : false} onChange={this.props.InputChange} name={`q_${data.id}_${ob[1]}`} type="checkbox" className="custom-control-input" id={`q_${data.id}_${ob[1]}`}/>
										<label className="custom-control-label" htmlFor={`q_${data.id}_${ob[1]}`}></label>
									</div>
								</li>
							);
						})}
  					</ul>
				</div>
			</div>
		);
	}
}

export default QuestionCard