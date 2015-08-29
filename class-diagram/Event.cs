using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ClassDiagramForCalendarApp
{
    public abstract class Content
    {
        public int Title
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int Time
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int Color
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public void toDomElement()
        {
            throw new System.NotImplementedException();
        }
    }
}