using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ClassDiagramForCalendarApp
{
    public abstract class InteractiveCalendar
    {
        public int StoredEvents
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int CurrentDate
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public abstract void display()
        {
            throw new System.NotImplementedException();
        }

        public void getNext()
        {
            throw new System.NotImplementedException();
        }

        public void getPrev()
        {
            throw new System.NotImplementedException();
        }
    }
}