import React, { useState, useEffect } from 'react'
import axios from 'axios'
//Components
import Modal from './components/Modal'
import BodySvg from './components/BodySvg'
//Style
import './App.scss'
//Images
import plus from './images/plus.svg'
import minus from './images/minus.svg'

const App = () => {
	const [waterValue, setWaterValue] = useState(0)
	const [waterValueMl, setWaterValueMl] = useState(0)
	const [valuePercent, setValuePercent] = useState(0)
	const [drunkTotalWater, setDrunkTotalWater] = useState(0)
	const [dayGoal, setDayGoal] = useState(0)
	const [chosedValue, setChosedValue] = useState(250)
	const [isOpen, setIsOpen] = useState(false)
	const [notification, setNotification] = useState('')
	const [message, setMessage] = useState('')
	const [api, setApi] = useState({
		isLoading: false,
		dataSource: [],
	})
	const url = 'https://qswkj1og35.execute-api.us-east-2.amazonaws.com/dev'
	//Reset
	const resetValues = () => {
		setValuePercent(0)
		setDayGoal(0)
		setDrunkTotalWater(0)
	}
	//Calculate to Liter
	const calculateToL = (number) => number / 1000
	//Calculate to 2 decimals
	const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2)

	//Set Water options
	const [optionsOfWater, setOptionsOfWater] = useState({
		active: 250,
		water: [100, 250, 350],
	})
	//Get chosen option
	const toggleActive = (value) => {
		setOptionsOfWater({
			...optionsOfWater,
			active: value,
		})
		setChosedValue(value)
	}
	//style chosen option
	const toggleActiveStyle = (value) =>
		optionsOfWater.water[optionsOfWater.water.indexOf(value)] ===
		optionsOfWater.active
			? 'strong'
			: ''
	//Subtraction water ml
	const subMinus = () => {
		let literNumber = calculateToL(chosedValue)
		const roundedDrunkTotalWater = addDecimals(drunkTotalWater);
		if (!waterValue) {
			alert('Chose your water target!')
			setNotification('red')
			return null;
		}
		if (roundedDrunkTotalWater <= 0) {
			return null
		}
		setDrunkTotalWater(roundedDrunkTotalWater - literNumber)
		setValuePercent(valuePercent - chosedValue / (waterValueMl / 100)) //Reduce water % and calculate % of chosen value
		setMessage('')
	}
	//Addination water ml to calculate
	const subPlus = () => {
		let literNumber = calculateToL(chosedValue)
		const roundedDrunkTotalWater = addDecimals(drunkTotalWater);
		if (!waterValue) {
			alert('Chose your water target!')
			setNotification('red')
			return null;
		}
		if (valuePercent >= 100 || roundedDrunkTotalWater >= waterValue) {
			return null
		}
		setDrunkTotalWater(drunkTotalWater + literNumber)
		setValuePercent(valuePercent + chosedValue / (waterValueMl / 100)) //Add water % and calculate % of chosen value
		setMessage('Nice work! Keep it up!')
	}

	useEffect(() => {
		async function getApi() {
			try {
				const { data } = await axios.get(url)
				let responseJson = await data.Items

				setApi({
					isLoading: false,
					dataSource: responseJson[0],
				})
			} catch (error) {
				console.error(error)
			}
		}

		getApi()
		setWaterValue(calculateToL(addDecimals(waterValueMl)))
	}, [waterValueMl])

	useEffect(() => {
		if (valuePercent >= 100) {
			setDayGoal(dayGoal + 1)
			setValuePercent(0)
			setDrunkTotalWater(0)
			setMessage('')
		}
		if (valuePercent < 0) {
			setValuePercent(0)
			setDrunkTotalWater(0)
			setMessage('')
		}
	}, [valuePercent, dayGoal])
	return (
		<div className='App'>
			<Modal
				open={isOpen}
				setWaterValueMl={setWaterValueMl}
				resetValues={resetValues}
				onClose={() => setIsOpen(false)}
				url={url}
				setNotification={setNotification}
			/>{' '}
			{
				//---------------Modal-------------------------------------------
			}
			<section className='head-group'>
				<div className='head'>
					<h1>{addDecimals(drunkTotalWater)} L</h1>
					<span>total water drunk</span>
				</div>
				<div className='head'>
					<h1>{dayGoal}</h1>
					<span>achieved goal days</span>
				</div>
			</section>
			<section className='body-group'>
				
				<BodySvg valuePercent={valuePercent} />
				<div className='body-info'>
					<button onClick={() => setIsOpen(true)}>
						<strong className={notification}>
							{addDecimals(waterValue)} L{' '}
						</strong>
						<i className='fas fa-pen'></i>
					</button>
				</div>
			</section>
			<h2>{message}</h2>
			<div className='options'>
				{
					//----------------------------------------Options-------------------
					optionsOfWater.water.map((value) => (
						<button
							key={value}
							onClick={() => toggleActive(value)}
							className={toggleActiveStyle(value)}
						>
							{value} ml
						</button>
					))
				}
			</div>
			<section className='adding-buttons'>
				<button onClick={subMinus}>
					<img src={minus} alt='minus' srcSet='' />
				</button>
				<button onClick={subPlus}>
					<img src={plus} alt='plus' srcSet='' />
				</button>
			</section>
		</div>
	)
}

export default App
