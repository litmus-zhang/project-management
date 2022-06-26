import React, { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { useMutation, useQuery } from '@apollo/client'
import { GET_CLIENTS } from '../queries/clientQueries'
import { GET_PROJECTS } from '../queries/projectQueries'
import Spinner from './Spinner'
import { ADD_PROJECT } from '../mutations/projectMutation'


export default function AddProjectModal()
{
    const [name, setName] = useState('');
    const [description, setdescriptio] = useState('');
    const [clientId, setclientId] = useState('');
    const [status, setStatus] = useState('new');

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, clientId, status },
    update(cache, { data: { addProject } })
    {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] }
      })
    }
  })

  //Get Clients for dropdown
  const {loading, error, data} =  useQuery(GET_CLIENTS);
  const onSubmit = (e) =>
  {
    e.preventDefault();
    if (name === `` || description === `` || status === ``)
    {
      return alert('Please fill all the fields');
    }
    // console.log(name, description, clientId, status);
    addProject(name, description, clientId, status);
    setName('');
    setdescriptio('');
    setclientId('');
    setStatus('new');
    }

  if (loading) return null;
  if (error) return "Something went wrong";
  return (
    <>
      {
        !loading && !error && (
          
          <>
          <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
              <div  className='d-flex align-items-center'>
                  <FaList className='icon' />  
                  <div>New Project</div>
  </div>
</button>


<div className="modal fade" id="addProjectModal" aria-labelledby="addProjectModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
                          <h5 className="modal-title" id="addProjectModalLabel">Add New Project
                          </h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={onSubmit}>
                              <div className='mb-3'>
                                  <label className='form-label'>Name</label>
                                  <input
                                      type="text"
                                      className='form-control'
                                      id="name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                  />
                              </div>                 
                              <div className='mb-3'>
                                  <label className='form-label'>description</label>
                                  <textarea
                                      className='form-control'
                                      id="description"
                                      value={description}
                                      onChange={(e) => setdescriptio(e.target.value)}
                                  />
                              </div>                 
                              <div className='mb-3'>
                                  <label className='form-label'>Status</label>
                  <select id="status" className='form-select' value={status}
                  onChange={(e) => setStatus(e.target.value)}>
                  
                    <option value="new">Not Started</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                                 </select>
                              </div>
                              <div className='mb-3'>
                                  <label className='form-label'>Client</label>
                  <select id="clientId" className='form-select' value={clientId}
                  onChange={(e) => setclientId(e.target.value)}>
                  
                    <option value="">Select Client</option>
                          {
                            data.clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name}</option>
                            ))
                      }
                                 </select>
                              </div>
                              <button
                                  type='submit'
                                  data-bs-dismiss="modal"
                                  className='btn btn-primary'>
                                    Submit
                              </button>
        </form>
      </div>
      
    </div>
  </div>
</div>
          </>
        )
      }


      </>
  )
}
