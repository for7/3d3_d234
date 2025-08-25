import { Outlet, Link, useLocation } from "ice";

function withOutlet() {
    return function(props) {
      console.log('Before render',  window.location.href);
      const result = <Outlet {...props} cc={'22'} context={{a: 1}}/>;
      console.log('After render');
      return result;
    }
  }

  export default withOutlet();