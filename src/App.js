import "./App.css"
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Modal , Input , Button, Form , Layout, Menu, theme } from 'antd';
import React from 'react';
import { Avatar, Badge, Space } from 'antd';
import {useState , useEffect} from 'react';
import axios from 'axios';
import { List } from 'antd';
import { Link } from 'react-router-dom'; // Import React Router
const { Header, Content, Footer, Sider } = Layout;
const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [user , setUser]=useState(null); // User State
  const [post,setPost]=useState([]) //Post State
  const [view,setView]=useState(null);
  useEffect(async ()=>{
      try{
        const randomUser = Math.floor(Math.random() * 10)+ 1;
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${randomUser}`);
        setUser(response.data)
        const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${randomUser}/posts`);
        setPost(postsResponse.data);
        // console.log(response.data,postsResponse.data)
      }
      catch(error){
        console.log(error);
      }
  }, []);
  const [visible, setVisible] = useState(false);
  const [selectedPost,setSelectedPost]=useState(null)
  const showModal = (item) => {
    setSelectedPost(item); 
    setVisible(true);
  };
  console.log(selectedPost,"modal item")
  // const handleFormSubmit = (values) => {
  //   handleCancel();
  // };

  const handleCancel = () => {
  setVisible(false);
  };
  const handleView = (id) => {
    console.log(id)
    let result=post.filter((data)=>data.id==id)
    console.log(result);
    setPost(result);
  };
  const [editFormValues, setEditFormValues] = useState({ title: '', body: '' });
  const handleEdit = (id) => {
    const selectedPost = post.find((data) => data.id === id);
    if (selectedPost) {
      setEditFormValues({
        title: selectedPost.title,
        body: selectedPost.body
      });
      setSelectedPost(selectedPost);
      showModal(selectedPost);
    }
  };
  const handleFormSubmit = async (values) => {
    try {
      const updatedPost = { ...selectedPost, ...values };
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`, updatedPost);
      // Perform any additional actions or updates you need
      console.log('Post updated successfully');
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            Blog
          </Menu.Item>
        </Menu>
        <Space size={24}>
          <Badge dot>
            <Avatar shape="square" icon={<UserOutlined />} />
          </Badge>
          <h1 style={{color: 'white', fontSize: '20px'}}>User Profile</h1>
        </Space>
        {user && (
          <div style={{color: 'white'}} className="user-details">
            <p style={{color: 'white'}} ><strong>Name:</strong>   {user.name}</p>
            <p style={{color: 'white'}} ><strong>UserName:</strong> {user.username}</p>
            <p style={{color: 'white'}}><strong>Email:</strong> {user.email}</p>
            <p style={{color: 'white'}}><strong>Phone:</strong> {user.phone}</p>
            <p style={{color: 'white'}}><strong>Website:</strong> {user.website}</p>
          </div>
        )}
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          {selectedPost ? (
            <div>
              {/* Show selected item */}
              <h2>{selectedPost.title}</h2>
              <p>{selectedPost.body}</p>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={post}
              renderItem={post => (
                <List.Item 
                actions={[<a key="list-loadmore-edit" to={`/app/posts/${post.id}`} onClick={()=> handleEdit(post.id)} >Edit</a>, <a key="list-loadmore-more">Delete</a> , <Link to={`/app/posts/${post.id}`} onClick={()=>handleView(post.id)} key="list-loadmore-view">View</Link>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${post.id}`} />}
                    title={<a href="https://ant.design">{post.title}</a>}
                    description={post.body}
                  />
                </List.Item>
              )}
            />
          )}
           
               <Modal
                  title="Edit Post"
                  visible={visible}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <Form
                    onFinish={handleFormSubmit}
                    initialValues={editFormValues}
                  >
                    <Form.Item
                      name="title"
                      label="Title"
                      initialValue={editFormValues.title} 
                      rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="body"
                      label="Body"
                      initialValue={editFormValues.body} 
                      rules={[{ required: true, message: 'Please enter a body' }]}
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" >Update</Button>
                    </Form.Item>
                  </Form>
                </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
