using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ClassDiagramForCalendarApp
{
    public abstract class Content
    {
        public int title
        {
            get
            {
                throw new System.NotImplementedException();
            }

            set
            {
            }
        }

        public int time
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