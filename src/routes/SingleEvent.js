import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { PartyQuery } from '../graphql/queries'
import Loader from '../components/Loader'
import RSVP from '../components/SingleEvent/RSVP'
import SetLimit from '../components/SingleEvent/SetLimit'
import EventInfo from '../components/SingleEvent/EventInfo'
import EventCTA from '../components/SingleEvent/EventCTA'
import EventFilters from '../components/SingleEvent/EventFilters'
import EventParticipants from '../components/SingleEvent/EventParticipants'

const SingleEventContainer = styled('div')``

class SingleEvent extends Component {
  state = {
    search: {
      value: ""
    }
  }

  handleSearch = (event) => {
    this.setState({
      search: {
        value: event.target.value
      }
    }
  }

  render() {
    const { address } = this.props.match.params
    return (
      <SingleEventContainer>
        <Query query={PartyQuery} variables={{ address }}>
          {({ data: { party }, loading }) => {
            if (loading) {
              return <Loader />
            }
            return (
              <div>
                <EventInfo party={party} address={address} />
                <EventCTA party={party} />
                <EventFilters handleSearch={handleSearch} />
                <EventParticipants party={party} />
                <RSVP address={address} />
                <SetLimit address={address} />
                {Object.entries(party).map(arr => {
                  if (arr[0] === 'participants') {
                    return ''
                  }
                  return <div>{`${arr[0]} ${arr[1]}`}</div>
                })}
                {party.participants.map(
                  ({ participantName, address, attended, paid }) => (
                    <Fragment>
                      <div>{participantName}</div>
                      <div>{address}</div>
                      <div>{attended.toString()}</div>
                      <div>{paid.toString()}</div>
                    </Fragment>
                  )
                )}
              </div>
            )
          }}
        </Query>
      </SingleEventContainer>
    )
  }
}

export default SingleEvent