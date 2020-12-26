import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from 'pages/admin/Home'
import PreviewRoom from 'pages/admin/PreviewRoom'
import NotFound from '../pages/static-page/NotFound'

export default function AdminRouter() {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/rooms/:room_id/preview' component={PreviewRoom} />
      <Route component={NotFound} />
    </Switch>
  )
}
