# Room
spawn energy ? cd ?

extension energy ?

link  energy ? cd ?

tower energy ? target.pos ? target.body ?

lab energy ? 矿物 ? cd ?

factory energy ? 矿物 ? cd ?

powerSpawn energy ? power ?

nuker energy ? 矿物 ? cd ?

observer room ?

storage store ?

terminal store ? cd ?

rampart hits ?

# Creep
energy Handling

    miner => harvest from source to source
    upgrader => upgrad from controllerLink to controller
    transferStation => transfer from centerLink to storage and storage to spawn extension tower
    transshipmentCtr => transfer from storage and terminal to lab factory powerSpawn nuker
    repairman => repair from storage to rampart
    architect => build from storage to new structure

room Guard

    repairman => repair from storage to rampart
    defender => attack creep
    defenseTower => attack creep or repair rampart
    transferStation => transfer from storage to tower

attack

    warrior =>  target or tower spawn 
    priest => heal warrior
    fleshShield => 挨打
    offensiveAndDefensive => 攻防一体

deposit powerBank harvest

    miner => harvest from terminal to deposit
    warrior => attack from spawn to powerBank
    priest => heal from spawn to warrior
    transportTruck => transfer from spawn to powerBank to terminal

newRoom

    occupier => claim controller
    architect => build spawn and other structures

outerMine

    miner => harvest from source to container
    transferStation => transfer from container to storage
    architect => build road container and 500tick to repair

# Structures

storage
terminal
spawn
tower 
extension
lab 
factory
link
powerSpawn
rampart
powerBank
deposit

# Memory
