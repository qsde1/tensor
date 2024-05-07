import { Layout, Flex } from "antd";

const Header = ({children, height = 64}) => {
    return (
        <Layout.Header
            style={{
                height,
                // borderBottom: ''
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                style={{
                    height: '100%',
                    padding: '0 15px',
                }}
            >
                {children}
            </Flex>
        </Layout.Header>
    )
}

export default Header;