import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CoreRoute, CoreRoutes } from "../types/routing.type.support";

type ProcessedRoute = { routeitem: JSX.Element | null; children: any[] };
const shuffled = (str: string) =>
  str
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");
const CoreSupportRoute: React.FC<{ routes: CoreRoutes }> = (props) => {
  let routesArr = mapRoutesToComponents(props.routes)
    .filter((itm) => itm.routeitem != null)
    .map((itm) => itm.routeitem);
  return (
    <BrowserRouter>
      <Routes>{routesArr}</Routes>
    </BrowserRouter>
  );
};

function mapRoutesToComponents(routes: CoreRoutes): ProcessedRoute[] {
  // stack is the temporary place where route definitions are stored
  let stack: CoreRoute[][] = [];
  // to store final rendered routes
  let JSXRoutes: ProcessedRoute[][] = []; 
  // timestamp is for key generation
  let timestamp = Math.round(Date.now() / 1000).toString(); 
  // iterate function adds the items to stack from where 
  // the items are converted to routes and pushed to JSXRoutes
  const iterate = (routes: CoreRoutes) => {
    let routeArr: CoreRoute[] = [];
    let nullArr: ProcessedRoute[] = [];
    routes.forEach((route) => {
      if (route.hasOwnProperty("path")) {
        routeArr.push(route);
        nullArr.push({ routeitem: null, children: [] });
      }
    });
    if (routeArr.length > 0) {
      stack.push([...routeArr]);
      JSXRoutes.push([...nullArr]);
    }
  };
  // Populate stack for the first time
  iterate(routes); 
  // processingIndex :: holds same NUMBER of elements as stack
  // - using this to identify which stack elements are being processed 
  // - need this for nested routing
  // [0, 3 , 2] - would mean the 2nd child of 3rd child of 0th route is processed
  let processingIndex: number[] = []; 
  let i = 0;
  // recursively create the elements
  while (stack.length > 0) {
    // Note: stack[lastStackIndex].length will vary since
    // we may call iterate function incase of children routes
    let lastStackIndex = stack.length - 1; 
    let currentProcessingIndex = 0; 
    if (processingIndex.length < stack.length) {
      processingIndex[lastStackIndex] = 0; // first item
    }
    // could be processingIndex[lastStackIndex]
    // OR processingIndex[processingIndex.length -1]
    // since both are same
    currentProcessingIndex = processingIndex[lastStackIndex];

    
    //for (let i = 0; i < stack[lastStackIndex].length; i++) 
    {
      
      let currentprocessingRoute =
        stack[lastStackIndex][currentProcessingIndex];
      if ( "children" in currentprocessingRoute &&
        currentprocessingRoute.children!.length > 0
      ) {
        // if the current Processing route has children
        // stop processing it push its children to stack, 
        // so that all it children would get processed first
        iterate(currentprocessingRoute.children!);
        // reset children here to avoid infinite loop
        delete currentprocessingRoute.children;
        //break;
      } else {
        let key = shuffled(timestamp + i.toString());
        // create the Route element with parameters
        let currentCreateRoute = createRoute(
          currentprocessingRoute,
          JSXRoutes[lastStackIndex][currentProcessingIndex].children,
          key
        );
        JSXRoutes[lastStackIndex][currentProcessingIndex].routeitem =
          currentCreateRoute;
        // now that we have set the route item reset children - this seems unnecessary
        JSXRoutes[lastStackIndex][currentProcessingIndex].children = [];

        if (currentProcessingIndex >= JSXRoutes[lastStackIndex].length - 1) {
          // we have processed the last item so pop
          if (lastStackIndex > 0) {
            //get previous subindex and move all the elemnts
            // in JSXRoutes last element as children of previous element
            // and pop it - don't pop if it is the only element
            let prevProcessingIndex = processingIndex[lastStackIndex - 1];
            let prevChildrenNodes = JSXRoutes[lastStackIndex]
              .filter((itms) => itms.routeitem != null)
              .map((itms) => {
                return itms.routeitem;
              });
            JSXRoutes[lastStackIndex - 1][prevProcessingIndex].children = [
              ...prevChildrenNodes,
            ];
            JSXRoutes.pop();
          }
          stack.pop();
          processingIndex.pop();
          //break;
        }
        processingIndex[lastStackIndex] += 1;
      }
    }
  }
  return JSXRoutes[0];
}

function createRoute(
  route: CoreRoute,
  children: JSX.Element[],
  key: string
): JSX.Element {
  let element: JSX.Element | React.ReactNode;
  if ("redirectTo" in route) {
    element = getNavigateComponent(
      route.redirectTo!,
      route.redirectReplace ?? false
    );
  } else if ("component" in route) {
    element = route.component;
  }
  return (
    <Route path={route.path} element={element} key={key}>
      {children}
    </Route>
  );
}
function getNavigateComponent(path: string, replace: boolean): JSX.Element {
  return <Navigate replace={replace} to={path} />;
}

export default CoreSupportRoute;
