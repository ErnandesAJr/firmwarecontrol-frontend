import React, { Component } from 'react';
import {Button, Input, InputLabel, FormHelperText} from '@material-ui/core';
import {CreateForm } from './styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload,uploading } from '../../store/actions'

import Upload from "../Upload"
import {uniqueId} from 'lodash';
import filesize from 'filesize';

import api from '../../services/api'

class Form extends Component {
  
  state = {
    nameProject:'',
    version:'',
    board:'',
    uploadingFile:'',
    message:'',
    modelVersion:'',
    nameSuggested:'nome_do_projeto_vX_x_x.bin'
  }

  handleClear = async () => {
    const uploadedFiles = JSON.parse(this.props.uploadFiles).filter( file => file.uploaded === true)
    this.props.upload(JSON.stringify(uploadedFiles))
    this.props.uploading(false)
    this.setState({
      uploadingFile:''
    })
  }

  handleUpload = file => {
    const uploadedFile = {
      file:file[0],
      id: uniqueId(),
      name: file[0].name,
      key:uniqueId(),
      readableSize: filesize(file[0].size),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }

    if(this.props.uploadFiles.length !== 0){
      this.props.upload(JSON.stringify(JSON.parse(this.props.uploadFiles).concat(uploadedFile)))
    }else{
      this.props.upload(JSON.stringify((this.props.uploadFiles).concat(uploadedFile)))
    }    

    this.props.uploading(true)

    this.setState({
      uploadingFile:uploadedFile
    })

  };

  handleNameProject = (e) =>{

    this.setState({nameProject: e.target.value})
  }

  handleVersion = (e) =>{
    const position = e.target.value.length - 1;
    const qtd = (e.target.value.split('_').length)
    if(e.target.value.length === 1 && e.target.value !== "v" ){
      e.target.value = ""
      this.setState({modelVersion: 'Comece com v. '})
    }else if(e.target.value.length > 1){
      if(!Number.isInteger(Number.parseInt(e.target.value[position])) && e.target.value[position] !== '_') {
        e.target.value = e.target.value.substring(0,position)
        this.setState({modelVersion: 'Apenas _ ou números.  '})
      }
      if(e.target.value[position] === '_' && Number.isInteger(Number.parseInt(e.target.value[position-1])) === false   ){
        e.target.value = e.target.value.substring(0,position)
        this.setState({modelVersion: 'Cuidado siga o '})
      }

      if(e.target.value[position] === '_' && qtd > 3 ){
        e.target.value = e.target.value.substring(0,position)
        this.setState({modelVersion: 'Você já digitou até o PATCH'})
      }
    }else{
      this.setState({modelVersion: ''})
    }
    this.setState({version: e.target.value})
  }

  handleBoard = (e) =>{
    this.setState({board: e.target.value})
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    if(this.state.version !== '' && this.state.nameProject !== '' && this.state.board !== ''){
      const major = this.state.version.split('v')[1].split('_')[0]
      const minor = this.state.version.split('v')[1].split('_')[1]
      const patch = this.state.version.split('v')[1].split('_')[2]
      this.setState({
        message:''
      })      
      this.processUpload(this.state.uploadingFile,this.state.nameProject,this.state.board,major,minor,patch)
    }else{
      this.setState({
        message:'Preencha os campos'
      })
    }
  }


  updateFile = (id, data) => {
    this.props.upload(JSON.stringify(JSON.parse(this.props.uploadFiles).map(uploadedFile => {
      return id === uploadedFile.id
        ? { ...uploadedFile, ...data }
        : uploadedFile;
    })))
  };

  processUpload = (uploadedFile, nameProject, board, major, minor, patch) => {
    const data = new FormData();

    data.append('file', uploadedFile.file);
    data.append('nameProject', nameProject);
    data.append('major', major);
    data.append('minor', minor);
    data.append('patch', patch);
    data.append('compatibleBoard', board);

    api.post('firmware', data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total))
        this.updateFile(uploadedFile.id, {
          progress
        });
      }
    }).then((response) => {
      this.updateFile(uploadedFile.id, {
        uploaded:true,
        id: response.data.firmware.id,
        url: response.data.firmware.url,
        nameProject:response.data.firmware.nameProject,
        version:response.data.firmware.version,
        compatibleBoard:response.data.firmware.compatibleBoard
      })
      this.setState({
        nameProject:'',
        board:'',
        version:'',
        uploadingFile:'',
        message:''
      })
    }).catch(()=> {
      this.setState({
        message:'Cancele o envio e verifique se o nome do arquivo é como nome_projeto_v0_0_0 e se já o enviou antes.'
      })
      this.updateFile(uploadedFile.id, {
        error:true
      })
    });
  }

  render() {

    return (
      <CreateForm onSubmit={this.handleSubmit}>

          <InputLabel  htmlFor="name-project" > Nome do Projeto </InputLabel>
          <Input required={true} id="name-project" value={this.state.nameProject} onChange={this.handleNameProject} />
        
          <InputLabel  htmlFor="board"> Placa Compatível </InputLabel>
          <Input required={true} id="board" value={this.state.board} onChange={this.handleBoard}/>

          <InputLabel htmlFor="version"> Versão </InputLabel>
          <Input required={true} id="version" value={this.state.version} onChange={this.handleVersion}/>
          <FormHelperText id="version"> {this.state.modelVersion} Padrão: v1_0_1 </FormHelperText>

          {!this.state.uploadingFile && 
            <Upload onUpload={this.handleUpload} ></Upload>
          }

          <FormHelperText id="nameSuggested"> Nome do arquivo: {this.state.nameSuggested}</FormHelperText>          

          {this.state.message &&
            <FormHelperText id="error"> Tente novamente, {this.state.message} </FormHelperText>
          }
          <Button id="button" type="submit" variant="contained" color="primary">
            Enviar
          </Button>

          {this.state.uploadingFile &&
            <Button onClick={this.handleClear} id="clear" type="submit" variant="contained" color="primary">
              Cancelar Upload
            </Button>
          }

      </CreateForm>

      )
  }
}

const mapStateToProps = store => ({  
  uploadFiles:store.uploadState.uploadFiles
});

const mapDispatchToProps = dispatch =>
bindActionCreators({ upload,uploading }, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(Form)