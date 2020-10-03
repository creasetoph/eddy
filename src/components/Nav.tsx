import React from "react";
import { NavItem } from "../data/Types"
import * as t from 'io-ts'
import _ from "lodash"
import { Card, Nav as BNav} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Switch, Route, useRouteMatch } from "react-router-dom"
import Item from "./Item";

interface NavProps {
  nav: t.TypeOf<typeof NavItem>
}

const Nav = (props: NavProps) => {

  const match = useRouteMatch();

  return (
    <Card>
      <Card.Header>
        <BNav variant="tabs" defaultActiveKey="#first">
          {_.map(props.nav.nav, nav => {
            return (
              <LinkContainer to={`${match.url}/${nav.name}`}>
                <BNav.Link>{nav.display}</BNav.Link>
              </LinkContainer>
            )
          })}
        </BNav>
      </Card.Header>
      <Card.Body>
        <Switch>
          {_.map(props.nav.nav, nav => {
            return (
              <Route exact path={`${match.path}/${nav.name}`}>
                <Item item={nav} />
              </Route>
            )
          })}
        </Switch>
      </Card.Body>
    </Card>
  )
}

export default Nav