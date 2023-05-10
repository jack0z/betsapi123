import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Select } from 'antd'
import styled from 'styled-components'
import TableView from './TableView'

const APICall = () => {
	const [allUSAMatches, setAllUSAMatches] = useState([])
	const [allWorldMatches, setAllWorldMatches] = useState([])
	const [showFor, setShowFor] = useState('USA')
	const [lastRefresh, setLastRefresh] = useState([])
	const [matchesToShow, setMatchesToShow] = useState([])
	const [filtersSelected, setFiltersSelected] = useState([])
	useEffect(() => {
		updateData()
	}, [])

	useEffect(() => {
		showFor === 'world' ? setMatchesToShow(filterData(filtersSelected, allWorldMatches)) : setMatchesToShow(filterData(filtersSelected, allUSAMatches))
	}, [showFor])

	useEffect(() => {
		const filteredResults = filterData(filtersSelected, showFor === 'world' ? allWorldMatches : allUSAMatches)
		setMatchesToShow(filteredResults)
	}, [filtersSelected])

	const fetchInplayEvents = async () => {
		try {
			const response = await axios.get('/api/proxy?apiUrl=https://api.b365api.com/v3/events/inplay&sport_id=18');
			// const response = await axios.get('https://api.b365api.com/v3/events/inplay?sport_id=18&token=154761-g9sYpS0kbXfwrV');
			return response.data.results;
		} catch (error) {
			console.error('Error fetching inplay events:', error);
			return [];
		}
	};
	
	const fetchEventDetails = async (eventId) => {
		try {
			const response = await axios.get(`/api/proxy?apiUrl=https://api.b365api.com/v1/event/view&event_id=${eventId}`);
			// const response = await axios.get(`https://api.b365api.com/v1/event/view?token=154761-g9sYpS0kbXfwrV&event_id=${eventId}`);
			return response.data.results[0];
		} catch (error) {
			console.error('Error fetching event details:', error);
			return null;
		}
	};

	const processEventData = (detailedData) => {
		const scoreArr = detailedData.ss.split('-');
		return {
			homeName: detailedData.home.name,
			awayName: detailedData.away.name,
			country: detailedData.league.cc,
			score: detailedData.ss,
			scoreDiff: parseInt(scoreArr[0]) - parseInt(scoreArr[1]),
			scoreTotal: parseInt(scoreArr[0]) + parseInt(scoreArr[1]),
			bet365Odds: { handicap: null },
			bet365OddsHandicap: null,
			timer: detailedData.timer,
			timerString: `${detailedData.timer.tm}min ${detailedData.timer.ts}sec`,
			stats: detailedData.stats,
			id: detailedData.id,
			key: detailedData.id,
			quarter: `${detailedData.timer.q}`,
			foulsHome: detailedData.stats.fouls[0],
			foulsAway: detailedData.stats.fouls[1],
			points2Home: detailedData.stats['2points'][0],
			points2Away: detailedData.stats['2points'][1],
			points3Home: detailedData.stats['3points'][0],
			points3Away: detailedData.stats['3points'][1],
			freeThrowsHome: detailedData.stats.free_throws[0],
			freeThrowsAway: detailedData.stats.free_throws[1],
			freeThrowsRateHome: detailedData.stats.free_throws_rate[0],
			freeThrowsRateAway: detailedData.stats.free_throws_rate[1],
			timeoutsHome: detailedData.stats.time_outs[0],
			timeoutsAway: detailedData.stats.time_outs[1],
		};
	};

	const updateData = async () => {
		const inplayEvents = await fetchInplayEvents();
	
		const eventDetailPromises = inplayEvents.map((event) => fetchEventDetails(event.id));
		const eventDetails = await Promise.all(eventDetailPromises);
	
		const filledWorldData = [];
		const filledUSAData = [];
	
		eventDetails.forEach((detailedData) => {
			if (
				detailedData &&
				Object.keys(detailedData.stats).length &&
				Object.keys(detailedData.timer).length &&
				detailedData.league.id !== '25067' &&
				detailedData.league.id !== '23105'
			) {
				const convertedObject = processEventData(detailedData);
	
				if (detailedData.league.cc === 'us') {
					filledUSAData.push(convertedObject);
				} else {
					filledWorldData.push(convertedObject);
				}
			}
		});
	
		console.log('Filled data: ', filledWorldData, filledUSAData);
	
		setAllWorldMatches(filledWorldData);
		setAllUSAMatches(filledUSAData);
		setLastRefresh(moment().format('YYYY-MM-DD hh:mm:ss'));
	};
	
 
	// const updateData = async () => {
	// 	// axios.get(`${process.env.REACT_APP_API_URL}/api/proxy?apiUrl=https://api.b365api.com/v3/events/inplay&sport_id=18`)
	// 	axios.get('https://api.b365api.com/v3/events/inplay?sport_id=18&token=154761-g9sYpS0kbXfwrV')
	// 	.then((res) => {
	// 		if (res?.data?.results) {
	// 			const filledWorldData = [];
	// 			const filledUSAData = [];
	// 			const fetchedData = res?.data?.results;
	// 			fetchedData.forEach((singleData, index) => {
	// 				// axios.get(`${process.env.REACT_APP_API_URL}/api/proxy?apiUrl=https://api.b365api.com/v1/event/view&event_id=${singleData.id}`)
	// 				axios.get(`https://api.b365api.com/v1/event/view?token=154761-g9sYpS0kbXfwrV&event_id=${singleData.id}`)
	// 					.then((eventData) => {
	// 						if (eventData?.data?.results[0]) {
	// 							const detailedData = eventData.data.results[0];
	// 							if (Object.keys(detailedData.stats).length && Object.keys(detailedData.timer).length && detailedData.league.id !== '25067' && detailedData.league.id !== '23105') {
	// 								console.log('Adding for id: ', detailedData.id, detailedData)
	// 								const scoreArr = (detailedData.ss).split('-')
	// 								const convertedObject = {
	// 									homeName: detailedData.home.name,
	// 									awayName: detailedData.away.name,
	// 									country: detailedData.league.cc,
	// 									score: detailedData.ss,
	// 									scoreDiff: parseInt(scoreArr[0]) - parseInt(scoreArr[1]),
	// 									scoreTotal: parseInt(scoreArr[0]) + parseInt(scoreArr[1]),
	// 									bet365Odds: { handicap: null },
	// 									bet365OddsHandicap: null,
	// 									timer: detailedData.timer,
	// 									timerString: `${detailedData.timer.tm}min ${detailedData.timer.ts}sec`,
	// 									//  ${detailedData.timer.tt} -> check what it means
	// 									stats: detailedData.stats,
	// 									id: detailedData.id,
	// 									key: detailedData.id,
	// 									// quarter: `${detailedData.timer.q} ${(detailedData.extra.numberofperiods !== '4' ? '2H' : '')}`,
	// 									quarter: `${detailedData.timer.q}`,
	// 									foulsHome: detailedData.stats.fouls[0],
	// 									foulsAway: detailedData.stats.fouls[1],
	// 									points2Home: detailedData.stats['2points'][0],
	// 									points2Away: detailedData.stats['2points'][1],
	// 									points3Home: detailedData.stats['3points'][0],
	// 									points3Away: detailedData.stats['3points'][1],
	// 									freeThrowsHome: detailedData.stats.free_throws[0],
	// 									freeThrowsAway: detailedData.stats.free_throws[1],
	// 									freeThrowsRateHome: detailedData.stats.free_throws_rate[0],
	// 									freeThrowsRateAway: detailedData.stats.free_throws_rate[1],
	// 									timeoutsHome: detailedData.stats.time_outs[0],
	// 									timeoutsAway: detailedData.stats.time_outs[1],
	// 									// numberofperiods: detailedData.extra.numberofperiods,
	// 								}
	// 								if (detailedData.league.cc === 'us') {
	// 									filledUSAData.push(convertedObject);
	// 								} else {
	// 									filledWorldData.push(convertedObject);
	// 								}
	// 							}
	// 							if (fetchedData.length - 1 === index) {
	// 								// came to the end, can push data to state
	// 								console.log('Filled data: ', filledWorldData, filledUSAData)
	// 								// If USA country then push in separate array.
	// 								setAllWorldMatches(filledWorldData);
	// 								setAllUSAMatches(filledUSAData);
	// 								setLastRefresh(moment().format('YYYY-MM-DD hh:mm:ss'))
	// 							}
	// 						}
	// 					})
	// 					.catch(err => console.error('Error getting detaild data', err));
	// 			})
	// 		}
	// 	})
	// 	.catch(e => console.error('Have error: ', e))
	// }

	const totalWorldMatches = allWorldMatches.length
	const totalUSAMatches = allUSAMatches.length

	const fetchBet365Odds = async (matchId) => {
		try {
			const response = await axios.get(`/api/proxy?apiUrl=https://api.b365api.com/v2/event/odds&event_id=${matchId}`);
// 			const response = await axios.get(`https://api.b365api.com/v2/event/odds?token=154761-g9sYpS0kbXfwrV&event_id=${matchId}`);
			if (
				response.data &&
				response.data.success === 1 &&
				response.data.results &&
				response.data.results.odds &&
				response.data.results.odds['18_3'] &&
				response.data.results.odds['18_3'][0]
			) {
				return response.data.results.odds['18_3'][0];
			}
			return null;
		} catch (error) {
			console.error('Error getting bet365 odds:', error);
			return null;
		}
	};

	const getBet365Odds = async (stateMatches) => {
		if (stateMatches.length > 0) {
			const oddsPromises = stateMatches.map((match) => fetchBet365Odds(match.id));
			const oddsResults = await Promise.all(oddsPromises);
	
			const matchesWithOdds = stateMatches.map((match, index) => {
				if (oddsResults[index]) {
					return { ...match, bet365Odds: oddsResults[index], bet365OddsHandicap: oddsResults[index].handicap };
				}
				return match;
			});
	
			setMatchesToShow(matchesWithOdds);
		}
	};

	// const getBet365Odds = (stateMatches) => {
	// 	const matchesWithOdds = [];
	// 	if (stateMatches.length > 0) {
	// 		stateMatches.forEach((stateMatch) => {
	// 			axios.get(`https://api.b365api.com/v2/event/odds?token=154761-g9sYpS0kbXfwrV&event_id=${stateMatch.id}`)
	// 			.then((dataBack) => {
	// 				console.log('DATA BACK: ', dataBack)
	// 				if (dataBack.data && dataBack.data.success === 1 && dataBack.data.results && dataBack.data.results.odds && dataBack.data.results.odds['18_3'] && dataBack.data.results.odds['18_3'][0]) {
	// 					console.log('DATABACK odds: ', dataBack.data.results.odds['18_3'][0])
	// 					const updatedStateMatch = { ...stateMatch, bet365Odds: dataBack.data.results.odds['18_3'][0], bet365OddsHandicap: dataBack.data.results.odds['18_3'][0].handicap }
	// 					// Update state with new values matchesToShow
	// 					matchesWithOdds.push(updatedStateMatch);
	// 					// setMatchesToShow(updateObjectInArray(matchesToShow, updatedStateMatch))
	// 				}
	// 			})
	// 			.catch(e => {
	// 				console.error('Error getting bet365 odds', e)
	// 			})
	// 		})
	// 		// console.log('matchesWithOdds: ', matchesWithOdds)
	// 		setTimeout(() => {
	// 		setMatchesToShow(matchesWithOdds)
	// 		}, 3000)
	// 	}
	// }

	const handleChange = (value) => {
		setFiltersSelected(value)
	};

	const filterData = (filters, data = null) => {
		const matchesToFilter = data ? data : (showFor === 'world' ? allWorldMatches : allUSAMatches)
		return matchesToFilter.filter(item => {
			let spreadPassed = !filters.includes('spread') || (Math.abs(item.scoreDiff) >= 3 && Math.abs(item.scoreDiff) <= 10)
			// Calculae team any tema fouls to be at least 4
			console.log('Bonus check: ', parseInt(item.foulsHome), parseInt(item.foulsAway))
			let bonusPassed = !filters.includes('bonus') || (parseInt(item.foulsHome) >= 4 || parseInt(item.foulsAway) >= 4)
			let totalsPassed = !filters.includes('totals') || (item.bet365Odds && item.bet365OddsHandicap && parseInt(item.bet365OddsHandicap) - item.scoreTotal < 17)
			// let totalsPassed = true;
			let timePassed = !filters.includes('time') || (parseInt(item.quarter) === 4)
			// let timePassed = !filters.includes('time') || (parseInt(item.quarter) === '3')
			return spreadPassed && totalsPassed && timePassed && bonusPassed
		});
	}

	const options = [
		{ label: 'Spread 3-10', value: 'spread'},
		{ label: 'Bonus (4+)', value: 'bonus'},
		{ label: 'Game Totals vs Score < 17', value: 'totals'}, 
		{ label: '4th Q', value: 'time'}, 
	]

	console.log('matchesToShow:', matchesToShow)
	return (
		<div>
			<p>Last refresh on: {lastRefresh}</p> <Button onClick={() => updateData()}>Update results (USA: {totalUSAMatches}, REST: {totalWorldMatches})</Button>
			<Button className={`${showFor === 'USA' ? 'selected' : null}`} onClick={() => setShowFor('USA')}>USA</Button>
			<Button className={`${showFor === 'world' ? 'selected' : null}`} onClick={() => setShowFor('world')}>World</Button>
			<p>SHOWING FOR: {showFor}</p>
			<Select
				mode="multiple"
				allowClear
				style={{ width: '500px' }}
				placeholder="Please select"
				onChange={handleChange}
				options={options}
			/>
			<Button onClick={() => getBet365Odds(matchesToShow)}>Get Bet365 Odds ({(matchesToShow.length)})</Button>
			{/* Have select filter options at top */}
			{/* Instead of this create a card for each team, inside of a card put a table */}
			<TableView data={matchesToShow} />
			{/* USA ONLY */}
			{/* {(matchesToShow.length > 0) &&
				matchesToShow.map((match) => (
					<OneMatch className="single_match">
							<p>{match.homeName} vs {match.awayName}</p>
							<p>Score: {match.score}</p>
							<p>Time left in quarter: {match.timer.tm}min {match.timer.ts}sec {match.timer.tt}</p>
							<p>Fouls (quarter: {match.timer.q}): {match.stats.fouls[0]} - {match.stats.fouls[1]}</p>
							<p>Quarter: {match.timer.q}</p>
							<Button onClick={() => getBet365Odds(match.id)}>Get Odds</Button>
							<TableStyled>
								<thead>
									<tr>
										<th>Statistic</th>
										<th>{match.homeName}</th>
										<th>{match.awayName}</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="bold">2 points</td>
										<td>{match.stats['2points'][0]}</td>
										<td>{match.stats['2points'][1]}</td>
									</tr>
									<tr>
										<td className="bold">3 points</td>
										<td>{match.stats['3points'][0]}</td>
										<td>{match.stats['3points'][1]}</td>
									</tr>
									<tr>
										<td className="bold">Fouls</td>
										<td>{match.stats.fouls[0]}</td>
										<td>{match.stats.fouls[1]}</td>
									</tr>
									<tr>
										<td className="bold">Free throws</td>
										<td>{match.stats.free_throws[0]}</td>
										<td>{match.stats.free_throws[1]}</td>
									</tr>
									<tr>
										<td className="bold">Free throw rate</td>
										<td>{match.stats.free_throws_rate[0]}</td>
										<td>{match.stats.free_throws_rate[1]}</td>
									</tr>
									<tr>
										<td className="bold">Time outs</td>
										<td>{match.stats.time_outs[0]}</td>
										<td>{match.stats.time_outs[1]}</td>
									</tr>
								</tbody>
							</TableStyled> 
						</OneMatch>
					))
			} */}
		</div>
	)
}

export default APICall

const Button = styled.button`
	font-size: 25px;
	border-radius: 4px;
	padding: 10px;
	margin-bottom: 20px;
	margin-left: 10px;
	margin-right: 10px;
	&.selected {
		background-color: grey;
		border: 4px solid black;
	}
`

// const OneMatch = styled.div`
// 	border: 1px solid black;
// 	max-width: 500px;
// 	margin-left: auto;
// 	margin-right: auto;
// 	border-radius: 4px;
// 	margin-bottom: 10px;
// `

// const TableStyled = styled.table`
// 	margin: 0 auto;
// 	border-collapse: collapse;
// 	margin-bottom: 20px;

// 	td, th {
// 		border: 1px solid black;
// 		text-align: center;
// 		padding: 5px;
// 	}
// 	th {
// 		white-space: nowrap;
// 		overflow: hidden;
// 		text-overflow: ellipsis;
// 		max-width: 145px;
// 	}
// 	td {
// 		&.bold {
// 			font-weight: 700;
// 		}
// 	}
// `
