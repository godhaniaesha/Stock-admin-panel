import React from 'react';
import moment from 'moment';
import '../styles/x_app.css';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      month: moment(),
      selected: moment().startOf('day')
    };
    
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }
  
  previous() {
    const { month } = this.state;
    this.setState({
      month: month.subtract(1, 'month'),
    });
  }

  next() {
    const { month } = this.state;
    this.setState({
      month: month.add(1, 'month'),
    });
  }
  
  // In the select method of Calendar component
  select(day) {
      this.setState({
          selected: day.date,
          month: day.date.clone(),
      });
      if (this.props.onSelect) {
          this.props.onSelect(day);
      }
  }

  renderWeeks() {
    let weeks = [];
    let done = false;
    let date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday");
    let count = 0;
    let monthIndex = date.month();

    const { selected, month } = this.state;

    while (!done) {
      weeks.push(
        <Week key={date}
          date={date.clone()}
          month={month}
          select={(day)=>this.select(day)}
          selected={selected} />
      );

      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

  renderMonthLabel() {
    const { month } = this.state;
    return <span className="x_month-label">{month.format("MMMM YYYY")}</span>;
  }

  render() {
    return (
      <section className="x_calendar">
        <header className="x_header">
          <div className="x_month-display x_row">
            <i className="x_arrow fa fa-angle-left" onClick={this.previous}/>
            {this.renderMonthLabel()}
            <i className="x_arrow fa fa-angle-right" onClick={this.next}/>
          </div>
          <DayNames />
        </header>
        {this.renderWeeks()}
      </section>
    );
  }
}

class DayNames extends React.Component {
  render() {
    return (
      <div className="x_row x_day-names">
        <span className="x_day">Sun</span>
        <span className="x_day">Mon</span>
        <span className="x_day">Tue</span>
        <span className="x_day">Wed</span>
        <span className="x_day">Thu</span>
        <span className="x_day">Fri</span>
        <span className="x_day">Sat</span>
      </div>
    );
  }
}

class Week extends React.Component {
  render() {
    let days = [];
    let { date } = this.props;
    
    const { month, selected, select } = this.props;

    for (var i = 0; i < 7; i++) {
      let day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };
      days.push(
        <Day key={date.toString()}
          day={day}
          selected={selected}
          select={select}/>
      );

      date = date.clone();
      date.add(1, "day");
    }

    return (
      <div className="x_row x_week" key={days[0]}>
        {days}
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const {
      day,
      day: { date, isCurrentMonth, isToday, number },
      select,
      selected
    } = this.props;

    return (
      <span
        key={date.toString()}
        className={`x_day${isToday ? " x_today" : ""}${isCurrentMonth ? "" : " x_different-month"}${date.isSame(selected) ? " x_selected" : ""}`}
        onClick={()=>select(day)}>{number}</span>
    );
  }
}

export default Calendar;