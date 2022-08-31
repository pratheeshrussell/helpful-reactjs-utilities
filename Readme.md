# Helpful Reactjs Utilities

Some functions I wrote to help with my transition from Angular to React.

## routing.support.tsx
This function generate react router V6 type components from JS Objects.

In **routes.tsx** use it as
```
import CoreSupportRoute from "./support/functions/routing.support";
import { CoreRoutes } from "./support/types/routing.type.support";
import Home from "./pages/home/home"

const RouteDef:CoreRoutes = [
    {
        path: '/home',
        component: <Home />
    },
    {
        path: '/'',
        redirectTo:'/home',
        redirectReplace:true
    }
];


function AppRoutes(){
    let newRouteElem = CoreSupportRoute({routes:RouteDef});
    return (newRouteElem)
}
export default AppRoutes
```

In **index.tsx**
```
import AppRoutes from './routes';

//  ....
root.render( AppRoutes());
// 
```