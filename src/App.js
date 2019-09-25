import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload } from './store/actions'

import filesize from 'filesize';

import api from './services/api'

import GlobalStyle from './styles/global';

import {Container,Content} from './styles';

import CreateForm from './components/Form';

import FileList from './components/FileList';

class App extends Component{
  state = {
    error:true
  }
  async componentDidMount(){   
    const response = await api.get('firmware');
    
    const uploadFiles = response.data.firmwares.map( file => ({
        id:file.id,
        name: file.name,
        key:file.key,
        readableSize: filesize(file.size),
        uploaded:true,
        compatibleBoard:file.compatibleBoard,
        nameProject:file.nameProject,
        version:file.version,
        url:file.url
    }))

    this.props.upload(JSON.stringify(uploadFiles))
    this.setState({
      error:false
    })
  }



  render (){

    let uploadedFiles = this.props.uploadFiles
    if(!this.state.error)
        JSON.parse(uploadedFiles)

    return (
      
      <Container>

        <Content>
          <CreateForm></CreateForm>            
        </Content>

        <Content>
          { !!(uploadedFiles).length && (
            <FileList onDelete={this.handleDelete}></FileList>
          )}
        </Content>
        
        < GlobalStyle />
      </Container>

      
    )
  }

}


const mapStateToProps = store => ({  
	uploadFiles:store.uploadState.uploadFiles
});

const mapDispatchToProps = dispatch =>
bindActionCreators({ upload }, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(App)
