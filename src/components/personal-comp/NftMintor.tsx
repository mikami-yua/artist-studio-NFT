import { useState } from "react"

import { Button, Checkbox, Form, Input } from 'antd';

import { useNavigate } from "react-router-dom"
import styles from './NftMintor.module.css'
const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    }
}
function NftMintor() {


    return (
        <div className={styles.CreatorWrapper}>
            <div className={styles.CreatorContainer}>

                <Input
                    placeholder="Asset Name"
                      className={styles.NftField}
              
                />


                <Input.TextArea
                    placeholder="Asset Description"
                      className={styles.NftField}
                 
                />

                <Input
                    type='file'
                    placeholder="Asset Image"
                    className={styles.NftField}
                  
                />


                <img width="350"  className={styles.NftImage}/>


                <Button type="primary" >
                    铸币
                </Button >



            </div>

        </div>
    )
}

export default NftMintor