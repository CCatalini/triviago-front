'use client'
import React, {useState} from 'react';
import Tab from "@/components/Tab";
import style from '@/styles/TabBar.module.css';

const TabBar = ({activeTab, setActiveTab}) => {


    return (
        <div className={style.tabBarContainer}>
            <Tab name={'Mis quizzes'} isActive={activeTab===0} onClick={()=> setActiveTab(0)}/>
            <Tab name={'Guardados'} isActive={activeTab===1} onClick={()=> setActiveTab(1)}/>
        </div>
    )

}

export default TabBar;
