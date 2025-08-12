import React,{use} from 'react'
import FormComponent from './ClientComp/body'
const page = (props) => {
 const params = use(props.params);
  const { token } = params;

    return <FormComponent token={token} />;

}

export default page