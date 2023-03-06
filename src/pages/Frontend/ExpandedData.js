import React, { useState } from 'react'
import { Button, Col, Row, Image } from 'antd'
// import dayjs from 'dayjs'

export default function ExpandedData(row) {

    const [visible, setVisible] = useState(false)

    let table = [
        { heading:"Title", data: row.data.title },
        { heading: "Location", data: row.data.location },
        { heading: "Description", data: row.data.description },
        { heading: "Photo", data: <Button type='link' className='p-0' onClick={() => { setVisible(true) }}>Click to See</Button> },
    ]
    
    return (
        <>
            <Row>
                <Col xs={24} md={{ span: 12, offset: 6 }}>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover mb-0">
                            <tbody>
                                {table.map((row, i) => {
                                    return <tr key={i}>
                                        <th>{row.heading}</th>
                                        <td>{row.data}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>

            <Image preview={{ visible, src:row.data.photo?.url, onVisibleChange: (value) => { setVisible(value) } }} />
        </>
    )
}
