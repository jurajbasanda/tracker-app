import React,{useState} from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

export default function Modal({ open, onClose, setWaterValueMl,resetValues ,url,setNotification}) {
	const [waterMl, setWaterMl] = useState(0)
	if (!open) {
		return null
	}
	const submitWaterValue = (e)=>{
		
		e.preventDefault()
		if(waterMl > 0){
		setWaterValueMl(waterMl)
		setNotification('')
		axios.put(url,{'WaterValue':waterMl})
		.then(res=>console.log(res))
		.catch(err=>console.log(err))
		resetValues()
		onClose()
	}
		else{alert('Please enter your new water target')}
	}
	return ReactDom.createPortal(
		<>
			<section className='overlayStyle'>
				<div className='modal'>
					<button onClick={onClose}>
						<i className='far fa-times-circle'></i>
					</button>
					<form className='modal-info' onSubmit={submitWaterValue}>
						<h1>Update Target Water</h1>
						<label htmlFor='value'>
							Please enter your new water target below:
						</label>
						<div>
							<input type='tel' id='value' name='number' value={waterMl} onChange={e=> setWaterMl(()=> e.target.value)} />
							<strong>ml</strong>
						</div>
						<div>
							<button>Update</button>
						</div>
					</form>
				</div>
			</section>
		</>,
		document.getElementById('portal')
	)
}
