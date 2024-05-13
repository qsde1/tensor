import { Modal, Form, Input, Typography, DatePicker } from "antd";
import PropTypes from "prop-types";


const ModalAddBoard = ({ setIsModalAddBoardOpen, isModalAddBoardOpen }) => {
    const handleOk = () => {
        setIsModalAddBoardOpen(false);
    };

    const handleCancel = () => {
        setIsModalAddBoardOpen(false);
    };

    return (
        <Modal
            title="Добавить доску"
            open={isModalAddBoardOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Пожалуйста, введите название!',
                        },
                    ]}
                >
                    <Typography.Title level={5}>Название</Typography.Title>
                    <Input showCount maxLength={20} />
                </Form.Item>

                <Form.Item>
                    <DatePicker
                        format={'DD MMMM YYYY'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAddBoard;

ModalAddBoard.propTypes = {
    isModalAddBoardOpen: PropTypes.bool.isRequired,
    setIsModalAddBoardOpen: PropTypes.func.isRequired
};
