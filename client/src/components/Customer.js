import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CustomerDelete from './CustomerDelete'
import CustomerUpdate from './CustomerUpdate'

class Customer extends React.Component {
    //고객 row 담당 js
    render() {
        return (
            <TableRow>
                <TableCell>{this.props.id}</TableCell>
                <TableCell><img src={this.props.image} alt="profile" /></TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.birthday}</TableCell>
                <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.job}</TableCell>
                <TableCell>
                    <CustomerDelete stateRefresh={this.props.stateRefresh} id={this.props.id} />
                    <CustomerUpdate 
                    stateRefresh={this.props.stateRefresh} id={this.props.id} name={this.props.name}
                    birthday={this.props.birthday} gender={this.props.gender} job={this.props.job} image={this.props.image}
                    />
                </TableCell>
            </TableRow>
        )
    }
}

export default Customer;

