import React, { Component } from 'react';
import Customer from './components/Customer'
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import CustomerAdd from './components/CustomerAdd';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    root: {
        width: "100%",
        minWidth: 1080
    },
    menu: {
        marginTop: 15,
        marginBottom: 15,
        display: 'flex',
        justifyContent: 'center'
    },
    paper: {
        marginLeft: 18,
        marginRight: 18
    },
    progress: {
        margin: theme.spacing(2)
    },
    grow: {
        flexGrow: 1,
    },
    tableHead: {
        fontSize: '1.0rem'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(9),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing(),
        paddingRight: theme.spacing(),
        paddingBottom: theme.spacing(),
        paddingLeft: theme.spacing(10),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    }
});

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customers: '',
            completed: 0,
            searchKeyword: ''
        }
        this.stateRefresh = this.stateRefresh.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
    }
    /*
    시작 초기화
    */

    stateRefresh() {
        this.setState({
            customers: '',
            completed: 0,
            searchKeyword: ''
        });
        this.callApi()
            .then(res => this.setState({ customers: res }))
            .catch(err => console.log(err));
    }
    /*
    stateRefresh 함수 실행 시 state 초기화 및 setState, callApi를 통한 data 재호출
    */

    componentDidMount() {
        this.timer = setInterval(this.progress, 20); //20ms 마다  progress 실행
        this.callApi()
            .then(res => this.setState({ customers: res }))
            .catch(err => console.log(err));
    }

    componentWillUnmount() {
        clearInterval(this.timer); //실행중인 setInterval 정지
    }

    callApi = async () => {
        const response = await fetch('/api/customers');
        const body = await response.json();
        return body; //서버에서 값을 받아 return
    }

    progress = () => {
        const { completed } = this.state;
        this.setState({ completed: completed >= 100 ? 0 : completed + 1 }); //completed 가 100보다 크면 0 아니면 1증가
    };

    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value; //event 발생 = 입력된 값
        this.setState(nextState);
    }

    render() {
        const filteredComponents = (data) => {
            data = data.filter((c) => {
                /*
                filter는 메소드 명처럼 비교연산에 true인 요소만 걸러서 재정의 시킨다.
                */
                return c.name.indexOf(this.state.searchKeyword) > -1; 
                /*
                indexof는 주어진 값과 일치하는 첫 번째 인덱스를 반환 없을 시에는 -1을 반환하기에 현재 searchkeyword 에 들어있는 값이 보유중인 목록의 name 에 포함되는지를 확인할 수 있다.
                */
            });
            return data.map((c) => {
                return <Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />
            });
            /*
            map은 요소를 일괄적으로 변경시킨다.
            때문에 모든 data의 요소들을 Customer.js 에 넣어준다.
            */
        }
        const { classes } = this.props;
        /*
        className을 통해 css 할당
        */
        const cellList = ["번호", "프로필 이미지", "이름", "생년월일", "성별", "직업", "설정"]
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>고객 관리 시스템</Typography>
                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="검색하기"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                name="searchKeyword"
                                value={this.state.searchKeyword}
                                onChange={this.handleValueChange}
                                
                            />
                            {/* 검색란 입력 시 handleValueChange 호출 및 name, value 전달*/}
                        </div>
                    </Toolbar>

                </AppBar>
                <div className={classes.menu}>
                    <CustomerAdd stateRefresh={this.stateRefresh} />{/*add시에 업데이트를 위해 stateRefresh method 보냄*/}
                </div>

                <Paper className={classes.paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {cellList.map(c => {
                                    return <TableCell className={classes.tableHead} key={c}>{c}</TableCell>
                                })}
                                {/*tablehead 목록 각 cell에 할당*/}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state.customers ? /*지금 customers에 데이터가 있을 경우 */
                                filteredComponents(this.state.customers) /*filteredComponents 에 지금 데이터를 담아 호출 */
                                : /*없을 경우 circularprogress 호출*/ 
                                <TableRow>
                                    <TableCell colSpan="6" align="center">
                                        <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(App);

