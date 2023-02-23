import React, { useState } from 'react'
import { Button, Col, Row, Image } from 'antd'
// import dayjs from 'dayjs'

export default function ExpandedData() {

    const [visible, setVisible] = useState(false)

    let table = [
        { heading: "Title", data: "Today" },
        { heading: "Location", data: "Faislabad" },
        { heading: "Description", data: "This is Description" },
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

            <Image preview={{ visible, src:"https://i.pinimg.com/originals/65/70/0a/65700a980202957502cf0ccf524a3897.jpg", onVisibleChange: (value) => { setVisible(value) } }} />
        </>
    )
}
