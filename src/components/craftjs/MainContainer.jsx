import { useNode } from "@craftjs/core";

export const MainContainer = ({ children}) => {
    const { connectors: {connect, drag} } = useNode();
    return (
        <div ref={ref => connect(drag(ref))} style={{height:"100%",margin: 0,padding:0}} >
            {children}
        </div>
    )
}