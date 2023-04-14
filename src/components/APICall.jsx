import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import styled from 'styled-components';
import TableView from './TableView';

const APICall = () => {
	const [allUSAMatches, setAllUSAMatches] = useState([]);
	const [allWorldMatches, setAllWorldMatches] = useState([]);
	const [showFor, setShowFor] = useState('USA')
	const [lastRefresh, setLastRefresh] = useState([]);
	useEffect(() => {
		updateData()
	}, [])

	const updateData = () => {
		axios.get('https://api.b365api.com/v3/events/inplay?sport_id=18&token=154761-g9sYpS0kbXfwrV')
		.then((res) => {
			// console.log(res)
	

			if (res?.data?.results) {
				const filledWorldData = [];
				const filledUSAData = [];
				const fetchedData = res?.data?.results;
				// console.log(fetchedData);
				// Move all events to state
				// or do another call now for each of them
				// For each of them sent the even view
				fetchedData.forEach((singleData, index) => {
					axios.get(`https://api.b365api.com/v1/event/view?token=154761-g9sYpS0kbXfwrV&event_id=${singleData.id}`)
						.then((eventData) => {
							// console.log(singleData.id, eventData)
							if (eventData?.data?.results[0]) {
								const detailedData = eventData.data.results[0];
								if (Object.keys(detailedData.stats).length && Object.keys(detailedData.timer).length) {
									console.log('Adding for id: ', detailedData.id, detailedData)
									// If USA country then push in separate array.
									// Add only if stats and timer objects are not empty
									const convertedObject = {
										awayName: detailedData.away.name,
										homeName: detailedData.away.name,
										country: detailedData.league.cc,
										score: detailedData.ss,
										timer: detailedData.timer,
										timerString: `${detailedData.timer.tm}min ${detailedData.timer.ts}sec ${detailedData.timer.tt}`,
										stats: detailedData.stats,
										id: detailedData.id,
										key: detailedData.id,
										quarter: detailedData.timer.q,
										foulsHome: detailedData.stats.fouls[0],
										foulsAway: detailedData.stats.fouls[0],
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
									}
									// Make async call to get odds for each
									if (detailedData.league.cc === 'us') {
										filledUSAData.push(convertedObject);
									} else {
										filledWorldData.push(convertedObject);
									}
								}
								if (fetchedData.length - 1 === index) {
									// came to the end, can push data to state
									console.log('Filled data: ', filledWorldData, filledUSAData)
									// If USA country then push in separate array.
									setAllWorldMatches(filledWorldData);
									setAllUSAMatches(filledUSAData);
									setLastRefresh(moment().format('YYYY-MM-DD hh:mm:ss'))
								}
							}
						})
						.catch(err => console.error('Error getting detaild data', err));
				})
			}
		})
		.catch(e => console.error('Have error: ', e))
	}

	const getBet365Odds = (bet365Id) => {
		axios.get(`https://api.b365api.com/v2/event/odds?token=154761-g9sYpS0kbXfwrV&event_id=${bet365Id}`)
			.then((data) => {
				console.log('Databack: ', data)
			})
			.catch(e => console.error('Error getting bet365 odds', e))

	}

	const matchesToShow = showFor === 'world' ? allWorldMatches : allUSAMatches
	return (
		<div>
			<p>Last refresh on: {lastRefresh}</p> <Button onClick={() => updateData()}>Update results (USA: {allUSAMatches.length}, REST: {allWorldMatches.length})</Button>
			<Button className={`${showFor === 'USA' ? 'selected' : null}`} onClick={() => setShowFor('USA')}>USA</Button>
			<Button className={`${showFor === 'world' ? 'selected' : null}`} onClick={() => setShowFor('world')}>World</Button>
			<p>SHOWING FOR: {showFor}</p>

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

const OneMatch = styled.div`
	border: 1px solid black;
	max-width: 500px;
	margin-left: auto;
	margin-right: auto;
	border-radius: 4px;
	margin-bottom: 10px;
`

const TableStyled = styled.table`
	margin: 0 auto;
	border-collapse: collapse;
	margin-bottom: 20px;

	td, th {
		border: 1px solid black;
		text-align: center;
		padding: 5px;
	}
	th {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 145px;
	}
	td {
		&.bold {
			font-weight: 700;
		}
	}
`