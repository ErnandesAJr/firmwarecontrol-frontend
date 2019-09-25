import React, { Component } from 'react';

import { CircularProgressbar } from 'react-circular-progressbar';
import {MdCheckCircle,MdError,MdLink} from 'react-icons/md'
import { FaFileCode } from 'react-icons/fa'

import api from '../../services/api'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload, uploading } from '../../store/actions'

import { Container,FileInfo,Preview, Search } from './styles';
import {Input, InputLabel, Select, MenuItem} from '@material-ui/core';

class FileList extends Component  {

    state = {
        searching:'',
        listFirmware:[],
        disabled:false,
        searchFor:'nameProject'
    }

    componentDidMount(){
        const uploadedFiles = JSON.parse(this.props.uploadFiles).filter( file => file.uploaded === true)
        this.props.upload(JSON.stringify(uploadedFiles))
        this.props.uploading(false) 
    }

    handleDelete = async id => {
        await api.delete(`firmware/${id}`);
        const uploadedFiles = JSON.parse(this.props.uploadFiles).filter( file => file.id !== id)
        this.props.upload(JSON.stringify(uploadedFiles))
    }

    handleSearch = (e) => {
        this.setState({searching: e.target.value})
    }

    handleChangeSearch = (e) =>{
        this.setState({searchFor: e.target.value})
    }

    listFiltered = (list) =>{
        if(list.filter(file =>file.uploaded === false).length > 0 ){
                return list.filter(file =>file.uploaded === false).map(this.liItem)
        }
    
        if(this.state.searching === ''){
            return list.map(this.liItem)
        }
    
        if(this.state.searching !== ''){
            if(this.state.searchFor === 'nameProject'){
                return list.filter(file => {
                    return -1 !== file.nameProject.indexOf(this.state.searching)
                }).map(this.liItem)
            }

            if(this.state.searchFor === 'compatibleBoard'){
                return list.filter(file => {
                    return -1 !== file.compatibleBoard.indexOf(this.state.searching)
                }).map(this.liItem)
            }
          
        }
    }

    liItem = (item) => {
        return (
                <li key={item.key}>
                <FileInfo>
                        <Preview>
                            <FaFileCode size={32} color="#ff4d00"></FaFileCode>
                        </Preview>
                        <div>
                            <strong>{item.name}</strong>
                            <span>{item.readableSize} 
                            {!!item.url && (
                                <button onClick={()=> this.handleDelete(item.id)}> Excluir</button>
                            )}
                            </span>
                        </div>
                
                </FileInfo>
                
                <div>

                    { !item.uploaded && !item.error && (
                        <CircularProgressbar
                            styles = {{
                                root: { width: 24},
                                path: { stroke: "#7159c1" }
                            }}
                            strokeWidth={10}
                            value={item.progress}
                        />
                    )}

                    {item.url && (
                        <a 
                            href={item.url}
                            target="_blank"    
                            rel="noopener noreferrer"
                        >
                            <MdLink style={{marginRight: 8 }} size={24} color="#222" ></MdLink>
                        </a>
                    )}
                    
                    
                    {item.uploaded && <MdCheckCircle size={24} color="#78e5d5"></MdCheckCircle> }

                    {item.error && <MdError size={24} color="red"></MdError> }

                </div>

            </li>
        )
    }

    render (){
        return(
          
            <Container>

                <Search>
                    <InputLabel htmlFor="search" > Pesquisar </InputLabel>
                    <Input disabled={this.props.isUploading} id="search" value={this.state.searching} onChange={this.handleSearch} ></Input>  
                   
                    <Select
                        value={this.state.searchFor}
                        onChange={this.handleChangeSearch}
                    >
                        <MenuItem value={'nameProject'}>Nome do Projeto</MenuItem>
                        <MenuItem value={'compatibleBoard'}>Placa Compátivel</MenuItem>
                    </Select>
                    
                </Search>



                {this.listFiltered(JSON.parse(this.props.uploadFiles))}
                
            </Container>
        )
    }
 
}

const mapStateToProps = store => ({  
    uploadFiles:store.uploadState.uploadFiles,
	isUploading:store.uploadingState.isUploading
});

const mapDispatchToProps = dispatch =>
bindActionCreators({ upload, uploading }, dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(FileList)