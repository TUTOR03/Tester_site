import React, {Component} from 'react'

class TestConstructorQuestion extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const {data} = this.props
		const {iter} = this.props
		return(
			<div className='col-sm-12 SingleAnswer ConSingleAnswer'>
				<div className='card mb-3'>
					<div className='card-header'>
						<button onClick={this.props.DelPositions} type='button' className='btn btn-danger btn-con-delete color-danger' name={`q_${iter}`}>
							<i className="fas fa-times"></i>
						</button>
						<div className='form-group'>
							<textarea value={data.q_text} onChange={this.props.InputChange} className="form-control" placeholder='ТЕКСТ ВОПРОСА' name={`q_${iter}`}></textarea>
						</div>
					</div>
					<ul className="list-group list-group-flush">
						{data.q_answers.map((ob,idx)=>{
							return(
								<li key={idx} className='list-group-item'>
									<button onClick={this.props.DelPositions} type='button' className='btn btn-danger btn-con-delete color-danger' name={`q_${iter}_${idx}`}>
										<i className="fas fa-times"></i>
									</button>
									<input onChange={this.props.InputChange} value={ob.a_text} className='form-control' placeholder='Ответ на вопрос' name={`q_${iter}_${idx}`}/>
									<div className='custom-control custom-control-inline custom-checkbox ml-2'>
										<input onChange={this.props.InputCheckChange} name={`q_${iter}_${idx}`} type="checkbox" className="custom-control-input" id={`q_${iter}_${idx}`}/>
										<label className="custom-control-label" htmlFor={`q_${iter}_${idx}`}></label>
									</div>	
								</li>
							);
						})}
					</ul>
						<button onClick={this.props.AddAnswer} type="button" name={`b_q_${iter}`} className='btn btn-outline-primary'>Добавить ответ</button>
				</div>
			</div>
		);
	}
}

export default TestConstructorQuestion;